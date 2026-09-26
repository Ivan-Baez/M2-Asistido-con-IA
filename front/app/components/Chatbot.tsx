'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/app/components/ToastContainer';

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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  movies?: any[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const fetchMovies = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/movies', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUserMovies(data);
      }
    } catch (error) {
      console.warn('Could not fetch movies for chatbot:', error);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
    addMessage('user', userMessage);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!res.ok) throw new Error('Error en el servidor');

      const data = await res.json();
      addMessage('assistant', data.response, data.movies);
    } catch (error) {
      console.error('Chatbot error:', error);
      addMessage('assistant', 'Lo siento, hubo un error de conexión. ¿Intentamos de nuevo?');
      showToast('error', 'Error conectando con el chatbot');
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      addMessage('assistant', '¡Hola! 🎬 Soy tu asistente cinematográfico. ¿En qué te ayudo hoy?\n\n• **Recomendaciones**: "Recomiéndame una de terror de los 80"\n• **Preguntas**: "¿Qué es el film noir?", "¿Quién dirigió Vértigo?"\n• **Tu catálogo**: "¿Cuál es mi película mejor valorada?"');
    }
  };

  const clearChat = () => {
    setMessages([]);
    addMessage('assistant', '¡Hola! 🎬 ¿En qué te ayudo ahora?');
  };

  const quickQuestions = [
    'Recomiéndame ciencia ficción > 8.5',
    '¿Qué es el film noir?',
    'Películas de Nolan después de 2010',
    '¿Quién ganó el Oscar 2024?'
  ];

  return (
    <>
      <button
        className={`btn btn-primary btn-lg btn-icon fixed bottom-6 right-6 z-50 shadow-xl ${isOpen ? 'bg-danger' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[500px] max-h-[70vh] card flex flex-col overflow-hidden animate-slideUp"
          role="dialog"
          aria-label="Chat cinematográfico"
          ref={chatContainerRef}
        >
          <div className="card-header flex items-center justify-between border-b border-border p-4 bg-elevated">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg">CineBot</h3>
                <p className="text-xs text-muted">Asistente cinematográfico</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={clearChat}
                aria-label="Limpiar conversación"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={toggleChat}
                aria-label="Cerrar chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl p-3 ${msg.role === 'user' ? 'bg-gold text-black rounded-tr-none' : 'bg-elevated border border-border rounded-tl-none'}`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    {msg.movies && msg.movies.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.movies.slice(0, 3).map((movie: any) => (
                          <div key={movie._id} className="flex items-center gap-2 p-2 bg-deep rounded-lg border border-border">
                            <img src={movie.poster} alt={movie.title} className="w-12 h-18 object-cover rounded" loading="lazy" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{movie.title}</p>
                              <p className="text-xs text-muted">{movie.year} • ⭐ {movie.rate}/10</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <time className={`text-xs text-muted mt-1 ${msg.role === 'user' ? 'text-right pr-1' : 'pl-1'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-elevated border border-border rounded-2xl rounded-tl-none p-3 animate-pulse">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gold/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-6 h-6 rounded-full bg-gold/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-6 h-6 rounded-full bg-gold/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length > 0 && messages.slice(-1)[0].role === 'assistant' && (
            <div className="px-4 py-2 border-t border-border bg-elevated/50">
              <p className="text-xs text-muted text-center mb-2">Sugerencias rápidas:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    className="btn btn-ghost btn-sm text-xs"
                    onClick={() => { setInput(q); sendMessage(); }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-border bg-elevated/50">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregúntame sobre cine o pide recomendaciones..."
                className="form-input flex-1"
                disabled={isLoading}
                aria-label="Tu mensaje"
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!input.trim() || isLoading}
                aria-label="Enviar mensaje"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-muted text-center mt-2">
              Escribe "hola" para empezar • Enter para enviar • Shift+Enter para nueva línea
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slideUp { animation: slideUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </>
  );
}