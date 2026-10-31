import { Router } from 'express';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const router = Router();
const audioCache = new Map<string, Buffer>();

/**
 * Synthesize ultra-realistic human Neural Voice using Microsoft Azure Neural Read Aloud Engine.
 * Provides authentic native German (Katja 👩 & Conrad 👨) and Arabic (Zariyah 👩 & Hamed 👨).
 */
async function synthesizeNeuralAudio(text: string, voiceName: string): Promise<Buffer> {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text);

    return await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const timer = setTimeout(() => {
        try {
          tts.close();
        } catch {}
        reject(new Error('Neural TTS timeout'));
      }, 7000);

      audioStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      audioStream.on('end', () => {
        clearTimeout(timer);
        try {
          tts.close();
        } catch {}
        resolve(Buffer.concat(chunks));
      });
      audioStream.on('error', (err) => {
        clearTimeout(timer);
        try {
          tts.close();
        } catch {}
        reject(err);
      });
    });
  } catch (err) {
    try {
      tts.close();
    } catch {}
    throw err;
  }
}

/**
 * Fallback to Google Translate native pronunciation engine if neural fails.
 */
async function synthesizeGoogleFallback(text: string, lang: string): Promise<Buffer> {
  const encodedText = encodeURIComponent(text.slice(0, 250));
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&client=tw-ob`;

  const response = await fetch(ttsUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Google TTS error status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// GET /api/audio/tts?text=Guten+Tag&lang=de&gender=female
router.get('/tts', async (req, res) => {
  try {
    const text = String(req.query.text || '').trim();
    const lang = String(req.query.lang || 'de').toLowerCase().startsWith('ar') ? 'ar' : 'de';
    const gender = String(req.query.gender || 'female').toLowerCase() === 'male' ? 'male' : 'female';

    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required.' });
    }

    const cacheKey = `${lang}:${gender}:${text.toLowerCase()}`;
    if (audioCache.has(cacheKey)) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('X-TTS-Source', 'cache');
      return res.send(audioCache.get(cacheKey));
    }

    // Determine target Neural Voice
    let voiceName = 'de-DE-KatjaNeural';
    if (lang === 'ar') {
      voiceName = gender === 'male' ? 'ar-SA-HamedNeural' : 'ar-SA-ZariyahNeural';
    } else {
      voiceName = gender === 'male' ? 'de-DE-ConradNeural' : 'de-DE-KatjaNeural';
    }

    let buffer: Buffer;
    try {
      buffer = await synthesizeNeuralAudio(text, voiceName);
    } catch (neuralErr: any) {
      console.warn(`[TTS] Neural synthesis failed for "${text.slice(0, 30)}": ${neuralErr.message}. Falling back.`);
      buffer = await synthesizeGoogleFallback(text, lang);
    }

    if (audioCache.size < 2000) {
      audioCache.set(cacheKey, buffer);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-TTS-Source', 'neural');
    return res.send(buffer);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
