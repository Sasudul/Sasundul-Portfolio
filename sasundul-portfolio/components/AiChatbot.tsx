// ═══════════════════════════════════════════════════════════════════
// AI CHATBOT — Sasundul (Sasa) Digital Twin
// Siri-style Hands-Free Voice Conversation, Barge-In Interruption, Draggable UI
// ═══════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { X, Send, Mic, MicOff, MessageSquare, VolumeX, RotateCcw, Sparkles, GripHorizontal, Square } from 'lucide-react';
import { streamChat, clearChatHistory } from './aiService';
import { getRandomChips } from './aiPersona';
import { useVoice } from './useVoice';
import './AiChatbot.css';

type ChatMode = 'text' | 'voice';
type PanelState = 'closed' | 'open';

interface DisplayMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  text: string;
  isStreaming?: boolean;
}

const AVATAR_URL = '/avatar.png';

// ── Clean & Render Text cleanly without raw ** asterisks ──
function FormattedMessageText({ text }: { text: string }) {
  const cleanedText = text
    .replace(/^[\d]+\.\s+\*\*/gm, '**')
    .replace(/^[-•]\s+\*\*/gm, '**');

  const paragraphs = cleanedText.split(/\n\s*\n/);

  return (
    <div className="space-y-3 leading-relaxed">
      {paragraphs.map((paragraph, pIdx) => {
        const parts = paragraph.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

        return (
          <p key={pIdx} className="text-[13px] text-white/90">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className="font-semibold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <em key={i} className="italic text-white/85">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code key={i} className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[12px] text-white">
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function AiChatbot() {
  const [panelState, setPanelState] = useState<PanelState>('closed');
  const [mode, setMode] = useState<ChatMode>('text');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);
  const [chips, setChips] = useState<string[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [autoListenAfterSpeech, setAutoListenAfterSpeech] = useState(true);

  // Dragging State
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveformAnimRef = useRef<number>(0);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Voice Engine with continuous call callbacks
  const voice = useVoice({
    onSpeechEnd: () => {
      // Hands-free voice loop: after AI finishes speaking, auto-listen for next user input if in voice mode
      if (modeRef.current === 'voice' && autoListenAfterSpeech) {
        setTimeout(() => {
          if (modeRef.current === 'voice') {
            voice.startListening();
          }
        }, 400);
      }
    },
    onInterrupted: () => {
      // User interrupted AI speech
      console.log('AI voice interrupted by user');
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Generate random chips on mount
  useEffect(() => {
    setChips(getRandomChips(4));
  }, []);

  // Waveform animation loop for voice mode
  useEffect(() => {
    if (mode !== 'voice' || panelState !== 'open') return;

    const bars = waveformRef.current?.children;
    if (!bars) return;

    const animate = () => {
      const level = voice.getAudioLevel();
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i] as HTMLElement;
        const rand = Math.random();
        const h = voice.isListening
          ? 6 + (level * 240 + rand * 20) * (1 - Math.abs(i - 7) / 9)
          : voice.isSpeaking
            ? 8 + Math.sin(Date.now() / 100 + i) * 14 + rand * 10
            : 4 + rand * 4;
        bar.style.height = `${Math.min(Math.max(h, 4), 36)}px`;
      }
      waveformAnimRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (waveformAnimRef.current) cancelAnimationFrame(waveformAnimRef.current);
    };
  }, [mode, panelState, voice.isListening, voice.isSpeaking]);

  // Auto-submit voice transcript when listening stops
  useEffect(() => {
    if (!voice.isListening && voice.transcript && mode === 'voice') {
      handleSend(voice.transcript);
    }
  }, [voice.isListening]);

  // ── Drag Handlers ──
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    setDragOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
  };

  // ── Panel Open/Close ──
  const openPanel = useCallback(() => {
    setPanelState('open');
    setDragOffset({ x: 0, y: 0 });

    requestAnimationFrame(() => {
      if (panelRef.current) {
        gsap.fromTo(panelRef.current,
          { opacity: 0, scale: 0.88, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' }
        );
      }
    });

    if (!hasGreeted) {
      setHasGreeted(true);
      setMessages([{
        id: 'greeting',
        role: 'ai',
        text: "Yo! I'm Sasa. Ask me anything about my projects, tech stack, or design process.",
      }]);
    }

    setTimeout(() => inputRef.current?.focus(), 400);
  }, [hasGreeted]);

  const closePanel = useCallback(() => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0, scale: 0.88, y: 30,
        duration: 0.28, ease: 'power2.in',
        onComplete: () => setPanelState('closed'),
      });
    }
    voice.stopListening();
    voice.stopSpeaking();
  }, [voice]);

  // Reset conversation
  const handleReset = () => {
    clearChatHistory();
    setMessages([{
      id: `reset-${Date.now()}`,
      role: 'ai',
      text: "Fresh chat! What do you wanna talk about?",
    }]);
    setChips(getRandomChips(4));
  };

  // ── Send Message ──
  const handleSend = useCallback(async (text?: string) => {
    const message = (text || inputValue).trim();
    if (!message || isThinking) return;

    // BARGE-IN: If AI is speaking while user sends new text or speech, STOP AI speech instantly!
    if (voice.isSpeaking) {
      voice.stopSpeaking();
    }

    if (message.toLowerCase() === '/terminal') {
      setTerminalMode(prev => !prev);
      setMessages(prev => [...prev, {
        id: `sys-${Date.now()}`,
        role: 'system',
        text: terminalMode ? '← Exited terminal mode' : '→ Terminal mode activated',
      }]);
      setInputValue('');
      return;
    }

    const userMsg: DisplayMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: message,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    setChips(getRandomChips(4));

    const aiMsgId = `ai-${Date.now()}`;
    let fullText = '';

    try {
      for await (const chunk of streamChat(message)) {
        fullText += chunk;
        setMessages(prev => {
          const existing = prev.find(m => m.id === aiMsgId);
          if (existing) {
            return prev.map(m => m.id === aiMsgId ? { ...m, text: fullText, isStreaming: true } : m);
          }
          return [...prev, { id: aiMsgId, role: 'ai', text: fullText, isStreaming: true }];
        });
      }

      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? { ...m, isStreaming: false } : m)
      );

      // Voice mode: speak response out loud (concise speech output)
      if (mode === 'voice' && fullText) {
        voice.speak(fullText);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'ai',
        text: "Something broke on my end. Try sending your message again.",
        isStreaming: false,
      }]);
    }

    setIsThinking(false);
  }, [inputValue, isThinking, mode, terminalMode, voice]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = useCallback(() => {
    if (voice.isSpeaking) {
      // Tapping mic while AI speaks cancels speech immediately!
      voice.stopSpeaking();
    } else if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  }, [voice]);

  // Floating Orb FAB (Closed state)
  if (panelState === 'closed') {
    return (
      <button
        className="ai-orb group"
        onClick={openPanel}
        aria-label="Talk to Sasa"
      >
        <div className="ai-orb__avatar-wrapper">
          <img
            src={AVATAR_URL}
            alt="Sasa Avatar"
            className="ai-orb__avatar-img"
          />
        </div>
        <span className="ai-orb__pulse" />
        <span className="ai-orb__tooltip">Talk to Sasa</span>
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`ai-panel ${terminalMode ? 'terminal-mode' : ''}`}
      data-lenis-prevent="true"
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
      }}
    >
      {/* ── Draggable Header Bar ── */}
      <div
        className="ai-panel__header select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="Click and drag to move chat window"
      >
        <div className="ai-panel__identity">
          <GripHorizontal size={16} className="text-white/30 cursor-grab active:cursor-grabbing hover:text-white/60 transition-colors" />
          <div className="ai-panel__avatar-frame">
            <img src={AVATAR_URL} alt="Sasa Wanasinghe" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="ai-panel__name flex items-center gap-1.5">
              {terminalMode ? 'sasundul.sh' : 'Sasa'}
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">AI</span>
            </div>
            <div className="ai-panel__status">
              <span className="ai-panel__status-dot" />
              {isThinking ? 'Thinking...' : voice.isSpeaking ? 'Speaking (tap to stop)' : voice.isListening ? 'Listening...' : 'Online'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            className="ai-panel__icon-btn"
            onClick={handleReset}
            title="Reset conversation"
          >
            <RotateCcw size={14} />
          </button>
          <button className="ai-panel__close" onClick={closePanel} title="Close chat">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Mode Toggle ── */}
      <div className="ai-mode-toggle">
        <button
          className={`ai-mode-toggle__btn ${mode === 'text' ? 'ai-mode-toggle__btn--active' : ''}`}
          onClick={() => { setMode('text'); voice.stopListening(); voice.stopSpeaking(); }}
        >
          <MessageSquare size={14} />
          Text Chat
        </button>
        <button
          className={`ai-mode-toggle__btn ${mode === 'voice' ? 'ai-mode-toggle__btn--active' : ''}`}
          onClick={() => { setMode('voice'); voice.startListening(); }}
        >
          <Mic size={14} />
          Sasa Voice Call
        </button>
      </div>

      {/* ── Messages Area ── */}
      <div
        className="ai-messages"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
      >
        {messages.map(msg => (
          <div key={msg.id} className={`ai-msg-row ai-msg-row--${msg.role}`}>
            {msg.role === 'ai' && !terminalMode && (
              <img src={AVATAR_URL} alt="Sasa" className="ai-msg__avatar" />
            )}
            <div className={`ai-msg ai-msg--${msg.role}`}>
              <FormattedMessageText text={msg.text} />
              {msg.isStreaming && <span className="ai-cursor" />}
            </div>
          </div>
        ))}

        {isThinking && !messages.find(m => m.isStreaming) && (
          <div className="ai-msg-row ai-msg-row--ai">
            {!terminalMode && <img src={AVATAR_URL} alt="Sasa" className="ai-msg__avatar" />}
            <div className="ai-typing">
              <span className="ai-typing__label">
                {terminalMode ? 'processing' : 'Sasa is thinking'}
              </span>
              <div className="ai-typing__dots">
                <span className="ai-typing__dot" />
                <span className="ai-typing__dot" />
                <span className="ai-typing__dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Context Chips ── */}
      {messages.length <= 2 && !isThinking && (
        <div className="ai-chips">
          <div className="w-full text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1 px-1 flex items-center gap-1.5">
            <Sparkles size={11} className="text-white/60" /> Suggested topics:
          </div>
          {chips.map((chip, i) => (
            <button
              key={i}
              className="ai-chip"
              onClick={() => handleSend(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* ── Text Input (Text Mode) ── */}
      {mode === 'text' && (
        <div className="ai-input-bar">
          <input
            ref={inputRef}
            type="text"
            className="ai-input-bar__field"
            placeholder={terminalMode ? '$ type a command or question...' : 'Ask me anything about Sasa...'}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            autoComplete="off"
          />
          <button
            className="ai-input-bar__send"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isThinking}
            title="Send message"
          >
            <Send size={15} />
          </button>
        </div>
      )}

      {/* ── Voice Input (Voice Call Mode) ── */}
      {mode === 'voice' && (
        voice.isSupported ? (
          <div className="ai-voice-area">
            {/* Center Avatar Visualizer */}
            <div className="relative flex items-center justify-center py-2">
              <div className={`ai-voice-avatar-ring ${voice.isListening ? 'ai-voice-avatar-ring--listening' : voice.isSpeaking ? 'ai-voice-avatar-ring--speaking' : ''}`}>
                <img src={AVATAR_URL} alt="Sasa Avatar" className="w-20 h-20 rounded-full object-cover p-1 bg-black/60 border border-white/20" />
              </div>
            </div>

            {/* Live transcript / status */}
            <div className="ai-voice-area__transcript">
              {voice.isListening
                ? voice.transcript || 'Listening... speak anytime'
                : voice.isSpeaking
                  ? 'Speaking (tap stop or say "stop" to interrupt)...'
                  : voice.error || 'Hands-free voice active. Say something!'}
            </div>

            {/* Waveform */}
            <div className="ai-waveform" ref={waveformRef}>
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`ai-waveform__bar ${voice.isListening ? 'ai-waveform__bar--active' : voice.isSpeaking ? 'ai-waveform__bar--speaking' : ''}`}
                  style={{ height: '4px' }}
                />
              ))}
            </div>

            {/* Mic / Interruption Controls */}
            <div className="flex items-center gap-3">
              {voice.isSpeaking ? (
                <button
                  className="ai-mic-btn ai-mic-btn--speaking-stop flex items-center gap-2 px-6 w-auto rounded-full bg-red-600/30 border-red-500 text-red-400 hover:bg-red-600/50"
                  onClick={() => voice.stopSpeaking()}
                  title="Stop AI speech (or just start talking)"
                >
                  <Square size={16} fill="currentColor" />
                  <span className="text-xs font-mono uppercase font-bold tracking-wider">Stop Speaking</span>
                </button>
              ) : (
                <button
                  className={`ai-mic-btn ${voice.isListening ? 'ai-mic-btn--active' : ''}`}
                  onClick={toggleVoice}
                  disabled={isThinking}
                  title={voice.isListening ? 'Pause microphone' : 'Start hands-free voice call'}
                >
                  {voice.isListening ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="ai-voice-unsupported">
            Voice conversation is best supported in Chrome, Edge, or Safari.<br />
            Switch to <b>Text Chat</b> mode to continue!
          </div>
        )
      )}
    </div>
  );
}
