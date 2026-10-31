import { Router } from 'express';
import prisma from '../prisma.js';
import { encryptApiKey, maskApiKey } from '../security/encryption.js';
import { executeAiCompletion } from '../ai/aiClient.js';
import { validateSafeUrl } from '../security/ssrfGuard.js';

const router = Router();

// GET all AI Providers (masked keys)
router.get('/', async (_req, res) => {
  try {
    const providers = await prisma.aiProvider.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });

    const safeProviders = providers.map((p) => ({
      ...p,
      hasApiKey: !!p.encryptedApiKey,
      maskedApiKey: p.encryptedApiKey ? '••••••••••••' : '',
      encryptedApiKey: undefined,
      apiKeyIv: undefined,
      apiKeyTag: undefined,
    }));

    res.json(safeProviders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create new AI Provider
router.post('/', async (req, res) => {
  try {
    const { name, providerType, apiKey, baseUrl, customEndpoint, customHeaders, modelName, isDefault } = req.body;

    if (!name || !providerType || !modelName) {
      return res.status(400).json({ error: 'Name, Provider Type, and Model Name are required.' });
    }

    // SSRF Check if Custom
    if (providerType === 'CUSTOM' && baseUrl) {
      const isSafe = await validateSafeUrl(baseUrl, true);
      if (!isSafe.isSafe) {
        return res.status(400).json({ error: `SSRF Validation Error: ${isSafe.reason}` });
      }
    }

    let encrypted = null;
    if (apiKey) {
      encrypted = encryptApiKey(apiKey);
    }

    if (isDefault) {
      await prisma.aiProvider.updateMany({ data: { isDefault: false } });
    }

    const provider = await prisma.aiProvider.create({
      data: {
        name,
        providerType,
        encryptedApiKey: encrypted?.cipherText || null,
        apiKeyIv: encrypted?.iv || null,
        apiKeyTag: encrypted?.tag || null,
        baseUrl: baseUrl || null,
        customEndpoint: customEndpoint || null,
        customHeaders: customHeaders ? JSON.stringify(customHeaders) : null,
        modelName,
        isDefault: !!isDefault,
        isActive: true,
      },
    });

    res.status(201).json({ ...provider, encryptedApiKey: undefined, apiKeyIv: undefined, apiKeyTag: undefined });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update AI Provider
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, providerType, apiKey, baseUrl, customEndpoint, customHeaders, modelName, isDefault, isActive } = req.body;

    const existing = await prisma.aiProvider.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Provider not found.' });

    let encryptedData = {};
    if (apiKey) {
      const enc = encryptApiKey(apiKey);
      encryptedData = {
        encryptedApiKey: enc.cipherText,
        apiKeyIv: enc.iv,
        apiKeyTag: enc.tag,
      };
    }

    if (isDefault) {
      await prisma.aiProvider.updateMany({ data: { isDefault: false } });
    }

    const updated = await prisma.aiProvider.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existing.name,
        providerType: providerType !== undefined ? providerType : existing.providerType,
        baseUrl: baseUrl !== undefined ? baseUrl : existing.baseUrl,
        customEndpoint: customEndpoint !== undefined ? customEndpoint : existing.customEndpoint,
        customHeaders: customHeaders !== undefined ? (typeof customHeaders === 'string' ? customHeaders : JSON.stringify(customHeaders)) : existing.customHeaders,
        modelName: modelName !== undefined ? modelName : existing.modelName,
        isDefault: isDefault !== undefined ? isDefault : existing.isDefault,
        isActive: isActive !== undefined ? isActive : existing.isActive,
        ...encryptedData,
      },
    });

    res.json({ ...updated, encryptedApiKey: undefined, apiKeyIv: undefined, apiKeyTag: undefined });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Provider
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.aiProvider.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Test Connection
router.post('/:id/test', async (req, res) => {
  const { id } = req.params;
  const startTime = Date.now();

  try {
    const provider = await prisma.aiProvider.findUnique({ where: { id } });
    if (!provider) return res.status(404).json({ error: 'Provider not found.' });

    const completion = await executeAiCompletion({
      providerId: id,
      userPrompt: 'Reply with the word "PONG" in German.',
      maxTokens: 10,
      temperature: 0.0,
    });

    const latencyMs = Date.now() - startTime;

    await prisma.aiProvider.update({
      where: { id },
      data: {
        latencyMs,
        lastTestedAt: new Date(),
        testStatus: 'SUCCESS',
        testError: null,
      },
    });

    res.json({
      status: 'SUCCESS',
      latencyMs,
      response: completion.text.trim(),
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = err.humanMessage || err.message || 'Connection test failed';

    await prisma.aiProvider.update({
      where: { id },
      data: {
        latencyMs,
        lastTestedAt: new Date(),
        testStatus: 'FAILED',
        testError: errorMsg,
      },
    });

    res.status(400).json({
      status: 'FAILED',
      latencyMs,
      error: errorMsg,
      actionableFix: err.actionableFix || 'Check provider API Key and Base URL.',
    });
  }
});

// POST Toggle Default Provider
router.post('/:id/set-default', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.aiProvider.updateMany({ data: { isDefault: false } });
    const provider = await prisma.aiProvider.update({
      where: { id },
      data: { isDefault: true, isActive: true },
    });
    res.json(provider);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
