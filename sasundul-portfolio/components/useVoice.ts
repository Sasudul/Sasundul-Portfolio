// ═══════════════════════════════════════════════════════════════════
// VOICE ENGINE — Siri-like Voice Engine with Real-Time Interruption (Barge-In)
// With Phonetic Name Pronunciation & Audio Analysis
// ═══════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from 'react';

function getSpeechRecognition(): (new () => SpeechRecognition) | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
}

export interface UseVoiceOptions {
  onSpeechEnd?: () => void;
  onInterrupted?: () => void;
}

export function useVoice(options?: UseVoiceOptions) {
  const [state, setState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isSupported: typeof window !== 'undefined' && Boolean(getSpeechRecognition()),
    transcript: '',
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const audioLevelRef = useRef<number>(0);
  const isSpeakingRef = useRef(false);

  // Keep options in ref
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  // ── STOP SPEAKING INSTANTLY (Barge-in / Interruption) ──
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    setState(s => ({ ...s, isSpeaking: false }));
  }, []);

  // ── SPEECH-TO-TEXT (Listening with Speech Interruption) ──
  const startListening = useCallback(() => {
    const SRConstructor = getSpeechRecognition();
    if (!SRConstructor) {
      setState(s => ({ ...s, error: 'Voice input not supported in this browser' }));
      return;
    }

    // BARGE-IN: If AI is currently speaking and user triggers mic, STOP speaking immediately!
    if (window.speechSynthesis?.speaking || isSpeakingRef.current) {
      stopSpeaking();
      optionsRef.current?.onInterrupted?.();
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const recognition = new SRConstructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState(s => ({ ...s, isListening: true, transcript: '', error: null }));
    };

    recognition.onresult = (event: any) => {
      // BARGE-IN: If AI is speaking while user speaks, stop AI speech instantly!
      if (window.speechSynthesis?.speaking || isSpeakingRef.current) {
        stopSpeaking();
        optionsRef.current?.onInterrupted?.();
      }

      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      
      // If user says "stop", "quiet", "be quiet", "shut up", "hold on"
      const lower = transcript.trim().toLowerCase();
      if (['stop', 'quiet', 'be quiet', 'shut up', 'hold on', 'pause'].includes(lower)) {
        stopSpeaking();
        recognition.stop();
        setState(s => ({ ...s, isListening: false, transcript: '' }));
        return;
      }

      setState(s => ({ ...s, transcript }));
    };

    recognition.onerror = (event: any) => {
      const errorMsg = event.error === 'not-allowed'
        ? 'Microphone access denied'
        : event.error === 'no-speech'
        ? ''
        : `Voice error: ${event.error}`;
      
      setState(s => ({ ...s, error: errorMsg || null, isListening: false }));
    };

    recognition.onend = () => {
      setState(s => ({ ...s, isListening: false }));
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.warn('Recognition start error:', e);
    }

    startAudioAnalysis();
  }, [stopSpeaking]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setState(s => ({ ...s, isListening: false }));
  }, []);

  // ── Audio Level Analysis for Waveform ──
  const startAudioAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / dataArray.length / 255;
        audioLevelRef.current = avg;
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Mic permission error handle silently
    }
  }, []);

  // ── TEXT-TO-SPEECH (Speaking with Phonetic Corrections & Short Trimming) ──
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // 1. Clean markdown formatting symbols
    let cleanText = text
      .replace(/```[\s\S]*?```/g, 'code block')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[*_~#]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ')
      .trim();

    // 2. SHORT SPEECH TRIM: Take first 2 sentences max (under 180 chars) for speech output
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    if (sentences.length > 2) {
      cleanText = sentences.slice(0, 2).join(' ');
    } else if (cleanText.length > 220) {
      cleanText = cleanText.slice(0, 220) + '...';
    }

    // 3. Phonetic Name Replacement
    cleanText = cleanText
      .replace(/Sasundul Wanasinghe/gi, 'Suh-soon-dool Wahn-uh-sing-heh')
      .replace(/Sasundul's/gi, 'Suh-soon-doolz')
      .replace(/Sasundul/gi, 'Suh-soon-dool')
      .replace(/Sasa's/gi, 'Sah-sahz')
      .replace(/\bSasa\b/gi, 'Sah-sah');

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = [
      'Google UK English Male',
      'Daniel',
      'Microsoft David',
      'Alex',
      'English United Kingdom',
    ];

    let selectedVoice = voices.find(v =>
      preferred.some(p => v.name.includes(p)) && v.lang.startsWith('en')
    );

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setState(s => ({ ...s, isSpeaking: true }));
    };
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setState(s => ({ ...s, isSpeaking: false }));
      optionsRef.current?.onSpeechEnd?.();
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setState(s => ({ ...s, isSpeaking: false }));
    };

    isSpeakingRef.current = true;
    setState(s => ({ ...s, isSpeaking: true }));
    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getAudioLevel: () => audioLevelRef.current,
  };
}
