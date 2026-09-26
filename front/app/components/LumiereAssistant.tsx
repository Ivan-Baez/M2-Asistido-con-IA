'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/app/components/ToastContainer';

type AssistantState = 'idle' | 'thinking' | 'speaking' | 'listening' | 'minimized';
type PanelState = 'closed' | 'opening' | 'open' | 'closing';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  movies?: any[];
}

interface Movie {
  _id: string;
  title: string;
  year: number;
  director: string;
  duration: string;
  genre: string[];
  rate: number;
  poster: string;
}

const QUICK_STARTERS = [
  { label: '🎬 Recomiéndame cine', prompt: 'Recomiéndame una buena película para ver hoy' },
  { label: '📚 Historia del cine', prompt: 'Cuéntame cómo nació el cine' },
  { label: '🎭 Directores legendarios', prompt: 'Háblame de Hitchcock y Kubrick' },
  { label: '✨ Dato curioso', prompt: 'Dame un dato curioso de cine' },
  { label: '🤔 Pregunta libre', prompt: '¿Cuánto es 42 * 17?' },
];

const IDLE_MESSAGES = [
  '👋 ¡Hola! Soy Lumière',
  '🎬 ¿Hablamos de cine?',
  '✨ Pregúntame lo que quieras',
  '🍿 Tu asistente a punto',
  '🌟 Lista para ayudarte',
];

export default function LumiereAssistant() {
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [panelState, setPanelState] = useState<PanelState>('closed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [idleMessageIndex, setIdleMessageIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number, size: number}>>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const { showToast } = useToast();

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  // Idle message rotation
  useEffect(() => {
    if (assistantState === 'idle' && panelState === 'closed') {
      const interval = setInterval(() => {
        setIdleMessageIndex(prev => (prev + 1) % IDLE_MESSAGES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [assistantState, panelState]);

  // Fetch movies for context
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:3001/movies', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUserMovies(data);
        }
      } catch (error) {
        console.warn('Could not fetch movies:', error);
      }
    };
    fetchMovies();
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Panel animation handlers
  const openPanel = useCallback(() => {
    setPanelState('opening');
    setAssistantState('listening');
    setTimeout(() => {
      setPanelState('open');
      setAssistantState('idle');
    }, 300);
  }, []);

  const closePanel = useCallback(() => {
    setPanelState('closing');
    setAssistantState('minimized');
    setTimeout(() => {
      setPanelState('closed');
      setAssistantState('idle');
    }, 300);
  }, []);

  const togglePanel = () => {
    if (panelState === 'closed') openPanel();
    else if (panelState === 'open') closePanel();
  };

  const addMessage = (role: 'user' | 'assistant', content: string, movies?: any[]) => {
    const newMessage: Message = {
      id: Math.random().toString(36).slice(2, 9),
      role,
      content,
      timestamp: new Date(),
      movies
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setAssistantState('thinking');
    addMessage('user', userMessage);

    // Build conversation history for context (last 6 messages)
    const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('http://localhost:3001/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history, userMovies })
      });

      if (!res.ok) throw new Error('Error en el servidor');

      const data = await res.json();
      setAssistantState(data.state || 'speaking');
      addMessage('assistant', data.response, data.movies);
      
      // Return to idle after speaking
      setTimeout(() => setAssistantState('idle'), 2000);
    } catch (error) {
      console.error('Assistant error:', error);
      addMessage('assistant', 'Lo siento, hubo un error de conexión. ¿Intentamos de nuevo? 😔');
      showToast('error', 'Error conectando con Lumière');
      setAssistantState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickStart = (prompt: string) => {
    setInput(prompt);
    sendMessage();
  };

  const clearChat = () => {
    setMessages([]);
    setAssistantState('speaking');
    setTimeout(() => {
      addMessage('assistant', '¡Hola de nuevo! ✨ ¿En qué te ayudo ahora?');
      setAssistantState('idle');
    }, 500);
  };

  // Memoized avatar styles based on state
  const avatarStyles = useMemo(() => {
    const base = {
      width: panelState === 'closed' ? 72 : 56,
      height: panelState === 'closed' ? 72 : 56,
    };
    
    const stateAnimations: Record<AssistantState, string> = {
      idle: 'float 4s ease-in-out infinite, pulse-glow 3s ease-in-out infinite',
      thinking: 'float 4s ease-in-out infinite, think-bounce 0.8s ease-in-out infinite',
      speaking: 'float 4s ease-in-out infinite, speak-pulse 0.4s ease-in-out infinite',
      listening: 'float 4s ease-in-out infinite, listen-wave 1.5s ease-in-out infinite',
      minimized: 'float 4s ease-in-out infinite, minimize-pulse 2s ease-in-out infinite',
    };

    return {
      ...base,
      animation: stateAnimations[assistantState],
    };
  }, [assistantState, panelState]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0 && panelState === 'open') {
      addMessage('assistant', `¡Hola! ✨ Soy **Lumière**, tu asistente cinematográfico personal.

Puedo ayudarte con:
🎬 **Cine & Series**: Recomendaciones, historia, directores, técnicas, premios
📚 **Conocimiento general**: Preguntas de cultura, ciencia, cálculos, curiosidades
💬 **Charla casual**: Solo conversar si te apetece
📊 **Tu catálogo**: Stats, favoritas, géneros preferidos

¿Por dónde empezamos? 😊`);
    }
  }, [panelState, messages.length]);

  return (
    <>
      {/* Floating Particles Background */}
      <div className="lumiere-particles" aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Avatar Button */}
      <button
        ref={avatarRef}
        className={`lumiere-avatar ${panelState === 'open' ? 'avatar-expanded' : ''} ${assistantState}`}
        onClick={togglePanel}
        aria-label={panelState === 'open' ? 'Cerrar a Lumière' : 'Abrir a Lumière'}
        aria-expanded={panelState === 'open'}
        style={avatarStyles as React.CSSProperties}
      >
        {/* Character Face */}
        <div className="avatar-face">
          {/* Eyes */}
          <div className="eyes">
            <div className={`eye left ${assistantState}`} />
            <div className={`eye right ${assistantState}`} />
          </div>
          
          {/* Mouth */}
          <div className={`mouth ${assistantState}`} />
          
          {/* Accessories - Film strip */}
          <div className="film-strip" aria-hidden="true">
            <span>▮</span><span>▮</span><span>▮</span><span>▮</span>
          </div>
        </div>

        {/* Status Ring */}
        <div className={`status-ring ${assistantState}`} aria-hidden="true">
          <div className="ring-pulse" />
        </div>

        {/* Idle Message Tooltip */}
        {panelState === 'closed' && assistantState === 'idle' && (
          <div className="idle-tooltip" role="status" aria-live="polite">
            {IDLE_MESSAGES[idleMessageIndex]}
          </div>
        )}

        {/* Minimized Indicator */}
        {panelState === 'closed' && assistantState === 'minimized' && (
          <div className="minimized-badge" aria-hidden="true">
            <span className="badge-dot" />
          </div>
        )}

        {/* Expand/Collapse Icon */}
        {panelState !== 'closed' && (
          <div className="expand-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <div
        ref={panelRef}
        className={`lumiere-panel ${panelState}`}
        role="dialog"
        aria-label="Lumière - Asistente cinematográfico"
        aria-modal="true"
      >
        {/* Panel Header */}
        <div className="panel-header">
          <div className="header-avatar">
            <div className="mini-face">
              <div className={`mini-eyes ${assistantState}`}>
                <span className="mini-eye" />
                <span className="mini-eye" />
              </div>
              <div className={`mini-mouth ${assistantState}`} />
            </div>
            <div className="header-info">
              <h3 className="assistant-name">Lumière</h3>
              <p className="assistant-status">
                {assistantState === 'thinking' && '💭 Pensando...'}
                {assistantState === 'speaking' && '💬 Hablando...'}
                {assistantState === 'listening' && '👂 Escuchando...'}
                {assistantState === 'idle' && '✨ Lista'}
                {assistantState === 'minimized' && '😴 Descansando'}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={clearChat}
              aria-label="Limpiar conversación"
              title="Nueva conversación"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
            <button
              className="icon-btn"
              onClick={closePanel}
              aria-label="Minimizar a Lumière"
              title="Minimizar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="panel-messages" ref={messagesContainerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? (
                  <div className="msg-mini-face">
                    <div className="msg-mini-eyes"><span /><span /></div>
                    <div className="msg-mini-mouth" />
                  </div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-inverse)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M4 22c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                )}
              </div>
              <div className="message-content">
                <div className="message-text whitespace-pre-wrap">{msg.content}</div>
                {msg.movies && msg.movies.length > 0 && (
                  <div className="message-movies">
                    {msg.movies.slice(0, 3).map((movie: any) => (
                      <div key={movie._id} className="movie-mini-card">
                        <img 
                          src={movie.poster} 
                          alt={movie.title} 
                          loading="lazy"
                          className="mini-poster"
                        />
                        <div className="mini-info">
                          <p className="mini-title">{movie.title}</p>
                          <p className="mini-meta">{movie.year} • ⭐ {movie.rate}/10</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <time className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message-bubble assistant loading-message">
              <div className="message-avatar">
                <div className="msg-mini-face thinking">
                  <div className="msg-mini-eyes"><span /><span /></div>
                  <div className="msg-mini-mouth" />
                </div>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starters (when empty or last message from assistant) */}
        {(messages.length === 0 || messages[messages.length - 1]?.role === 'assistant') && panelState === 'open' && (
          <div className="quick-starters" role="list" aria-label="Sugerencias rápidas">
            <p className="starters-label">💡 Para empezar:</p>
            <div className="starters-grid">
              {QUICK_STARTERS.map((starter) => (
                <button
                  key={starter.prompt}
                  className="starter-btn"
                  onClick={() => handleQuickStart(starter.prompt)}
                  role="listitem"
                >
                  {starter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="panel-input">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="input-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
                className="message-input"
                disabled={isLoading}
                autoFocus
                aria-label="Tu mensaje para Lumière"
              />
              <button
                type="submit"
                className="send-btn"
                disabled={!input.trim() || isLoading}
                aria-label="Enviar mensaje"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="input-hint">
              🎬 Cine • 📚 General • 💡 Ideas • 🤝 Charla
            </p>
          </form>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        /* ========================================
           LUMIÈRE ASSISTANT - CINEMATIC STYLES
           ======================================== */
        
        /* Particles Background */
        .lumiere-particles {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 200px;
          height: 200px;
          pointer-events: none;
          z-index: 90;
          border-radius: 50% 0 0 0;
          overflow: hidden;
          opacity: 0.6;
        }
        
        .particle {
          position: absolute;
          background: radial-gradient(circle, var(--color-gold) 0%, transparent 70%);
          border-radius: 50%;
          animation: particle-float linear infinite;
          opacity: 0.7;
        }
        
        @keyframes particle-float {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-150px) scale(0); opacity: 0; }
        }

        /* Avatar Button */
        .lumiere-avatar {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          background: linear-gradient(145deg, var(--color-bg-card) 0%, var(--color-bg-elevated) 100%);
          border: 2px solid var(--color-border);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-spring);
          box-shadow: 
            var(--shadow-xl),
            0 0 0 1px rgba(212, 168, 42, 0.1),
            inset 0 1px 1px rgba(255,255,255,0.05);
          overflow: hidden;
        }
        
        .lumiere-avatar:hover {
          transform: scale(1.08);
          border-color: var(--color-gold);
          box-shadow: 
            var(--shadow-xl),
            0 0 30px var(--color-gold-glow),
            0 0 60px var(--color-gold-glow);
        }
        
        .lumiere-avatar:focus-visible {
          outline: 3px solid var(--color-gold);
          outline-offset: 4px;
        }
        
        .lumiere-avatar.avatar-expanded {
          transform: scale(0.9);
          border-color: var(--color-gold);
        }

        /* Face Animation */
        .avatar-face {
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        
        .eyes {
          display: flex;
          gap: 6px;
        }
        
        .eye {
          width: 10px;
          height: 10px;
          background: var(--color-text-inverse);
          border-radius: 50%;
          position: relative;
          transition: all var(--transition-base);
        }
        
        .eye::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--color-gold);
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform var(--transition-fast);
        }
        
        /* Eye States */
        .eye.idle::before { animation: eye-look 6s ease-in-out infinite; }
        .eye.thinking::before { animation: eye-think 1s ease-in-out infinite; }
        .eye.speaking::before { animation: eye-speak 0.3s ease-in-out infinite; }
        .eye.listening::before { animation: eye-listen 2s ease-in-out infinite; }
        .eye.minimized::before { opacity: 0.3; }
        
        @keyframes eye-look {
          0%, 40%, 60%, 100% { transform: translate(0, 0); }
          45% { transform: translate(2px, 0); }
          55% { transform: translate(-2px, 0); }
        }
        
        @keyframes eye-think {
          0%, 100% { transform: translate(-2px, -1px); }
          50% { transform: translate(2px, 1px); }
        }
        
        @keyframes eye-speak {
          0%, 100% { transform: translate(0, 1px) scaleY(1.2); }
          50% { transform: translate(0, -1px) scaleY(0.8); }
        }
        
        @keyframes eye-listen {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -2px); }
        }
        
        .mouth {
          width: 14px;
          height: 6px;
          border-bottom: 2px solid var(--color-gold);
          border-radius: 0 0 10px 10px;
          transition: all var(--transition-fast);
        }
        
        .mouth.idle { border-radius: 0 0 10px 10px; }
        .mouth.thinking { border-radius: 50%; width: 8px; height: 8px; border: 2px solid var(--color-gold); border-top-color: transparent; }
        .mouth.speaking { animation: mouth-speak 0.15s ease-in-out infinite; }
        .mouth.listening { border-radius: 0 0 4px 4px; height: 4px; }
        .mouth.minimized { opacity: 0.4; transform: scaleX(0.6); }
        
        @keyframes mouth-speak {
          0%, 100% { height: 6px; border-radius: 0 0 10px 10px; }
          50% { height: 10px; border-radius: 0 0 14px 14px; }
        }
        
        .film-strip {
          position: absolute;
          bottom: -4px;
          display: flex;
          gap: 1px;
          font-size: 6px;
          color: var(--color-gold);
          opacity: 0.6;
          animation: film-move 3s linear infinite;
        }
        
        .film-strip span { width: 6px; height: 8px; background: var(--color-bg-deep); border: 1px solid var(--color-gold); border-radius: 1px; display: flex; align-items: center; justify-content: center; }
        
        @keyframes film-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-14px); }
        }
        
        /* Status Ring */
        .status-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid transparent;
        }
        
        .status-ring.idle { border-color: var(--color-gold); opacity: 0.4; }
        .status-ring.thinking { border-color: var(--color-gold-light); opacity: 0.6; }
        .status-ring.speaking { border-color: var(--color-success); opacity: 0.8; }
        .status-ring.listening { border-color: var(--color-gold); opacity: 1; }
        .status-ring.minimized { border-color: var(--color-text-muted); opacity: 0.3; }
        
        .ring-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, var(--color-gold), transparent 30%);
          animation: ring-spin 3s linear infinite;
          opacity: 0.3;
        }
        
        @keyframes ring-spin { to { transform: rotate(360deg); } }
        
        /* Avatar Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px var(--color-gold-glow); }
          50% { box-shadow: 0 0 40px var(--color-gold-glow), 0 0 60px var(--color-gold-glow); }
        }
        
        @keyframes think-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
        
        @keyframes speak-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes listen-wave {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @keyframes minimize-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        /* Tooltip */
        .idle-tooltip {
          position: absolute;
          right: 90px;
          bottom: 50%;
          transform: translateY(50%);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          white-space: nowrap;
          box-shadow: var(--shadow-lg);
          animation: tooltip-in 300ms var(--transition-spring);
          pointer-events: none;
        }
        
        @keyframes tooltip-in {
          from { opacity: 0; transform: translateY(50%) translateX(10px); }
          to { opacity: 1; transform: translateY(50%) translateX(0); }
        }
        
        .idle-tooltip::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: var(--color-border);
        }
        
        /* Minimized Badge */
        .minimized-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 20px;
          height: 20px;
          background: var(--color-danger);
          border: 2px solid var(--color-bg-deep);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: badge-pop 300ms var(--transition-spring);
        }
        
        .badge-dot {
          width: 8px;
          height: 8px;
          background: var(--color-text-primary);
          border-radius: 50%;
          animation: badge-pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes badge-pop {
          0% { transform: scale(0) rotate(-180deg); }
          50% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        
        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        
        .expand-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--color-gold);
          opacity: 0;
          transition: opacity var(--transition-fast);
          pointer-events: none;
        }
        
        .lumiere-avatar.avatar-expanded .expand-icon {
          opacity: 1;
        }

        /* Panel */
        .lumiere-panel {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 48px);
          max-height: 600px;
          height: 520px;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl), 0 0 60px var(--color-gold-glow);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1000;
          transform-origin: bottom right;
        }
        
        .lumiere-panel.closed { display: none; }
        .lumiere-panel.opening { animation: panel-open 300ms var(--transition-spring) forwards; }
        .lumiere-panel.open { display: flex; animation: panel-open 300ms var(--transition-spring) forwards; }
        .lumiere-panel.closing { animation: panel-close 250ms ease-in forwards; }
        
        @keyframes panel-open {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes panel-close {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.9) translateY(20px); }
        }
        
        /* Header */
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-5);
          border-bottom: 1px solid var(--color-border);
          background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-card) 100%);
        }
        
        .header-avatar { display: flex; align-items: center; gap: var(--space-3); }
        
        .mini-face {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-muted) 100%);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          box-shadow: 0 0 20px var(--color-gold-glow);
        }
        
        .mini-eyes { display: flex; gap: 4px; }
        .mini-eye { width: 6px; height: 6px; background: var(--color-text-inverse); border-radius: 50%; }
        .mini-mouth { width: 10px; height: 4px; border-bottom: 1.5px solid var(--color-text-inverse); border-radius: 0 0 6px 6px; }
        
        .mini-eyes.thinking .mini-eye { animation: mini-think 1s ease-in-out infinite; }
        .mini-eyes.speaking .mini-eye { animation: mini-speak 0.2s ease-in-out infinite; }
        .mini-eyes.listening .mini-eye { animation: mini-listen 1.5s ease-in-out infinite; }
        .mini-mouth.thinking { border-radius: 50%; width: 6px; height: 6px; border: 1.5px solid var(--color-text-inverse); border-top-color: transparent; }
        .mini-mouth.speaking { animation: mini-mouth-speak 0.15s ease-in-out infinite; }
        .mini-mouth.listening { border-radius: 0 0 3px 3px; height: 2px; }
        
        @keyframes mini-think { 0%,100% { transform: translateX(-1px); } 50% { transform: translateX(1px); } }
        @keyframes mini-speak { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes mini-listen { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
        @keyframes mini-mouth-speak { 0%,100% { height: 4px; } 50% { height: 6px; } }
        
        .header-info { flex: 1; min-width: 0; }
        .assistant-name { font-family: var(--font-display); font-size: var(--text-lg); color: var(--color-gold); margin: 0; }
        .assistant-status { font-size: var(--text-xs); color: var(--color-text-muted); margin: 0; font-weight: 500; }
        
        .header-actions { display: flex; gap: var(--space-1); }
        .icon-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: 1px solid var(--color-border);
          border-radius: var(--radius-full); color: var(--color-text-secondary);
          cursor: pointer; transition: all var(--transition-fast);
        }
        .icon-btn:hover { background: var(--color-gold); border-color: var(--color-gold); color: var(--color-text-inverse); }
        
        /* Messages */
        .panel-messages {
          flex: 1; overflow-y: auto; padding: var(--space-4);
          display: flex; flex-direction: column; gap: var(--space-4);
        }
        
        .message-bubble { display: flex; gap: var(--space-3); animation: msg-in 300ms var(--transition-spring); }
        .message-bubble.user { flex-direction: row-reverse; }
        
        @keyframes msg-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .message-avatar {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%; background: var(--color-bg-elevated); border: 1px solid var(--color-border);
        }
        
        .message-bubble.user .message-avatar { background: var(--color-gold); border-color: var(--color-gold); }
        
        .msg-mini-face { width: 24px; height: 24px; background: linear-gradient(135deg, var(--color-gold), var(--color-gold-muted)); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
        .msg-mini-eyes { display: flex; gap: 2px; }
        .msg-mini-eyes span { width: 4px; height: 4px; background: var(--color-text-inverse); border-radius: 50%; }
        .msg-mini-mouth { width: 6px; height: 2px; border-bottom: 1px solid var(--color-text-inverse); border-radius: 0 0 4px 4px; }
        .msg-mini-face.thinking .msg-mini-eyes span { animation: mini-think 1s ease-in-out infinite; }
        .msg-mini-face.thinking .msg-mini-mouth { border-radius: 50%; width: 4px; height: 4px; border: 1px solid var(--color-text-inverse); border-top-color: transparent; }
        
        .message-content { flex: 1; min-width: 0; }
        .message-text { font-size: var(--text-sm); line-height: 1.6; color: var(--color-text-primary); }
        .message-bubble.user .message-text { color: #ffffff; }
        .message-bubble.user .message-content { background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-muted) 100%); border-radius: var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl); }
        .message-bubble.assistant .message-content { background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm); }
        .message-bubble { padding: var(--space-3); max-width: 85%; }
        .message-bubble.assistant { align-self: flex-start; }
        .message-bubble.user { align-self: flex-end; flex-direction: row-reverse; }
        .message-avatar { width: 32px; height: 32px; flex-shrink: 0; display: flex; align-items: flex-start; justify-content: center; border-radius: 50%; background: var(--color-bg-elevated); border: 1px solid var(--color-border); margin-top: 2px; }
        .message-bubble.user .message-avatar { background: var(--color-gold); border-color: var(--color-gold); }
        
        .message-movies { margin-top: var(--space-2); display: flex; flex-direction: column; gap: var(--space-2); }
        .movie-mini-card { display: flex; gap: var(--space-2); padding: var(--space-2); background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
        .mini-poster { width: 40px; height: 60px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0; }
        .mini-info { flex: 1; min-width: 0; }
        .mini-title { font-size: var(--text-xs); font-weight: 600; color: var(--color-text-primary); margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mini-meta { font-size: var(--text-xs); color: var(--color-text-muted); margin: 0; }
        
        .message-time { font-size: var(--text-xs); color: var(--color-text-muted); display: block; margin-top: var(--space-1); }
        .message-bubble.user .message-time { text-align: right; }
        
        .loading-message .typing-indicator { display: flex; gap: 4px; padding: var(--space-2) 0; }
        .typing-indicator span { width: 8px; height: 8px; background: var(--color-gold); border-radius: 50%; animation: typing 1.4s ease-in-out infinite both; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1.2); opacity: 1; } }
        
        /* Quick Starters */
        .quick-starters { padding: 0 var(--space-4) var(--space-4); border-top: 1px solid var(--color-border); background: var(--color-bg-card); }
        .starters-label { font-size: var(--text-xs); color: var(--color-text-muted); margin: 0 0 var(--space-3); font-weight: 500; }
        .starters-grid { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .starter-btn { padding: var(--space-2) var(--space-3); background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: var(--text-xs); color: var(--color-text-secondary); cursor: pointer; transition: all var(--transition-fast); white-space: nowrap; }
        .starter-btn:hover { border-color: var(--color-gold); color: var(--color-gold); background: var(--color-gold-glow); }
        
        /* Input */
        .panel-input { padding: var(--space-4); border-top: 1px solid var(--color-border); background: var(--color-bg-elevated); }
        .input-form { display: flex; flex-direction: column; gap: var(--space-2); }
        .input-wrapper { display: flex; gap: var(--space-2); }
        .message-input { flex: 1; padding: var(--space-3) var(--space-4); background: var(--color-bg-deep); border: 1px solid var(--color-border); border-radius: var(--radius-full); color: var(--color-text-primary); font-size: var(--text-sm); font-family: var(--font-body); transition: all var(--transition-fast); }
        .message-input:focus { outline: none; border-color: var(--color-gold); box-shadow: 0 0 0 3px var(--color-gold-glow); }
        .message-input::placeholder { color: var(--color-text-muted); }
        .send-btn { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--color-gold), var(--color-gold-muted)); border: none; color: var(--color-text-inverse); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all var(--transition-base); box-shadow: var(--shadow-md), var(--shadow-gold); }
        .send-btn:hover:not(:disabled) { transform: scale(1.05) rotate(10deg); box-shadow: var(--shadow-lg), var(--shadow-gold-hover); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .input-hint { font-size: var(--text-xs); color: var(--color-text-muted); text-align: center; margin: 0; }
        
        /* Responsive */
        @media (max-width: 480px) {
          .lumiere-panel { width: calc(100vw - 32px); right: 16px; bottom: 100px; height: 70vh; max-height: 500px; }
          .lumiere-avatar { bottom: 16px; right: 16px; }
        }
        
        @media (max-width: 768px) and (min-width: 481px) {
          .lumiere-panel { width: 360px; right: 16px; }
        }
        
        /* Ensure panel doesn't overlap with header/footer */
        @media (max-height: 600px) {
          .lumiere-panel { height: 80vh; max-height: 480px; bottom: 100px; }
        }
        
        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </>
  );
}