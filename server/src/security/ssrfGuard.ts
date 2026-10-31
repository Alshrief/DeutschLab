import dns from 'dns/promises';
import net from 'net';
import { URL } from 'url';

/**
 * Checks if an IPv4 address is in a private, loopback, or link-local range.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed = unsafe
  }

  const [b0, b1] = parts;

  // 127.0.0.0/8 (Loopback)
  if (b0 === 127) return true;

  // 10.0.0.0/8 (Private)
  if (b0 === 10) return true;

  // 172.16.0.0/12 (Private: 172.16.0.0 - 172.31.255.255)
  if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;

  // 192.168.0.0/16 (Private)
  if (b0 === 192 && b1 === 168) return true;

  // 169.254.0.0/16 (Link-Local & Cloud Metadata, e.g. AWS 169.254.169.254)
  if (b0 === 169 && b1 === 254) return true;

  // 0.0.0.0/8 (Current network)
  if (b0 === 0) return true;

  return false;
}

/**
 * Checks if an IPv6 address is loopback, unique local, or link-local.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  // fc00::/7 (Unique Local Address)
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  // fe80::/10 (Link-Local)
  if (normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) {
    return true;
  }
  return false;
}

/**
 * Validates whether an endpoint URL is safe against SSRF attacks.
 * Allows localhost only if explicitly permitted (e.g. for local Ollama/vLLM during dev).
 */
export async function validateSafeUrl(
  rawUrl: string,
  allowLocalhost = false
): Promise<{ isSafe: boolean; reason?: string; resolvedIp?: string }> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { isSafe: false, reason: 'Invalid URL syntax.' };
  }

  // Enforce protocol
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isSafe: false,
      reason: `Disallowed protocol: '${parsed.protocol}'. Only HTTP and HTTPS are permitted.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Handle explicit localhost / 127.0.0.1 for local Ollama development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (allowLocalhost) {
      return { isSafe: true, resolvedIp: '127.0.0.1' };
    }
    return { isSafe: false, reason: 'Access to localhost is blocked by SSRF policy.' };
  }

  // If host is directly an IP address
  if (net.isIPv4(hostname)) {
    if (isPrivateIPv4(hostname)) {
      return { isSafe: false, reason: `Private IPv4 address blocked: ${hostname}` };
    }
    return { isSafe: true, resolvedIp: hostname };
  }

  if (net.isIPv6(hostname)) {
    if (isPrivateIPv6(hostname)) {
      return { isSafe: false, reason: `Private IPv6 address blocked: ${hostname}` };
    }
    return { isSafe: true, resolvedIp: hostname };
  }

  // Resolve hostname via DNS to prevent DNS rebinding
  try {
    const lookup = await dns.lookup(hostname, { all: true });
    for (const record of lookup) {
      if (record.family === 4 && isPrivateIPv4(record.address)) {
        return {
          isSafe: false,
          reason: `DNS resolves to private IPv4 address: ${record.address}`,
          resolvedIp: record.address,
        };
      }
      if (record.family === 6 && isPrivateIPv6(record.address)) {
        return {
          isSafe: false,
          reason: `DNS resolves to private IPv6 address: ${record.address}`,
          resolvedIp: record.address,
        };
      }
    }

    return { isSafe: true, resolvedIp: lookup[0]?.address };
  } catch (err: any) {
    return { isSafe: false, reason: `DNS lookup failed for host ${hostname}: ${err.message}` };
  }
}
