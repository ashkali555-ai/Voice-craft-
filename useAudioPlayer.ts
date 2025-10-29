
import { useState, useRef, useCallback, useEffect } from 'react';

// Audio parameters from Gemini TTS API
const SAMPLE_RATE = 24000;
const NUM_CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

// --- Base64 and Audio Decoding Helpers ---
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePcmData(
  pcmData: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(pcmData.buffer);
  const frameCount = dataInt16.length / NUM_CHANNELS;
  const buffer = ctx.createBuffer(NUM_CHANNELS, frameCount, SAMPLE_RATE);

  for (let channel = 0; channel < NUM_CHANNELS; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * NUM_CHANNELS + channel] / 32768.0;
    }
  }
  return buffer;
}


// --- WAV File Creation Helper ---
function createWavBlob(pcmData: Uint8Array): Blob {
    const headerLength = 44;
    const buffer = new ArrayBuffer(headerLength + pcmData.length);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    const blockAlign = NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
    const byteRate = SAMPLE_RATE * blockAlign;

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, NUM_CHANNELS, true);
    view.setUint32(24, SAMPLE_RATE, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, BITS_PER_SAMPLE, true);
    writeString(36, 'data');
    view.setUint32(40, pcmData.length, true);

    const pcmAsUint8 = new Uint8Array(pcmData.buffer);
    const wavBytes = new Uint8Array(buffer);
    wavBytes.set(pcmAsUint8, headerLength);
    
    return new Blob([wavBytes], { type: 'audio/wav' });
}


// --- Custom Hook ---
const useAudioPlayer = () => {
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioContextRef = useRef<AudioContext>();
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);

  useEffect(() => {
    // Initialize AudioContext on the client side
    // FIX: Pass sampleRate to AudioContext constructor for correct playback.
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: SAMPLE_RATE });
    return () => {
      audioContextRef.current?.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  const stop = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.onended = null;
      // FIX: The stop method on AudioBufferSourceNode might require an argument in some environments. Passing 0 stops playback immediately.
      sourceRef.current.stop(0);
      sourceRef.current = null;
    }
    if(timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
  }, []);

  const play = useCallback(async (speed: number = 1.0) => {
    if (!audioData || !audioContextRef.current) return;
    if(isPlaying) {
        // This is now a pause action
        sourceRef.current?.stop(); // This will trigger the 'onended' event
        pausedTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current;
        if(timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
        return;
    }

    try {
      const pcmData = decodeBase64(audioData);
      const audioBuffer = await decodePcmData(pcmData, audioContextRef.current);

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speed;
      source.connect(audioContextRef.current.destination);

      const offset = pausedTimeRef.current;
      source.start(0, offset);
      startTimeRef.current = audioContextRef.current.currentTime - offset;

      sourceRef.current = source;
      setDuration(audioBuffer.duration);
      setIsPlaying(true);
      
      timerRef.current = window.setInterval(() => {
          if (audioContextRef.current) {
            const newTime = audioContextRef.current.currentTime - startTimeRef.current;
            setCurrentTime(newTime > audioBuffer.duration ? audioBuffer.duration : newTime);
          }
      }, 100);

      source.onended = () => {
        if (sourceRef.current === source) {
            const elapsedTime = audioContextRef.current!.currentTime - startTimeRef.current;
            if (elapsedTime >= audioBuffer.duration - 0.1) {
                // Playback finished naturally
                stop();
            }
        }
      };

    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
    }
  }, [audioData, isPlaying, stop]);
  
  const download = useCallback(() => {
    if (!audioData) return;
    try {
      const pcmData = decodeBase64(audioData);
      const wavBlob = createWavBlob(pcmData);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voicecraft_output.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create download:', error);
    }
  }, [audioData]);

  return { audioData, isPlaying, play, stop, download, setAudioData, duration, currentTime };
};

export default useAudioPlayer;