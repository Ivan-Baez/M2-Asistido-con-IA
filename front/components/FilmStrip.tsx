'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface FilmStripMovie {
  _id: string;
  title: string;
  year: number;
  poster: string;
  rate: number;
  genres: string[];
}

interface FilmStripProps {
  movies?: FilmStripMovie[];
  currentPath?: string;
  className?: string;
}

function getGenreKey(genre: string): string {
  return genre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const NAV_ITEMS = [
  { href: '/', label: 'INICIO', icon: '🏠' },
  { href: '/about', label: 'SOBRE EL PROYECTO', icon: '📋' },
  { href: '/history', label: 'HISTORIA DEL CINE', icon: '🎞️' },
  { href: '/create', label: 'CREAR PELÍCULA', icon: '✏️' },
];

export default function FilmStrip({ movies = [], currentPath = '/', className = '' }: FilmStripProps) {
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const allFrames = [
    ...NAV_ITEMS.map((item, i) => ({
      type: 'nav' as const,
      key: `nav-${i}`,
      href: item.href,
      label: item.label,
      icon: item.icon,
      isActive: currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href)),
    })),
    ...movies.slice(0, 12).map((movie, i) => ({
      type: 'movie' as const,
      key: `movie-${movie._id}`,
      id: movie._id,
      title: movie.title,
      year: movie.year,
      poster: movie.poster,
      genres: movie.genres || [],
    })),
  ];

  return (
    <>
      <style jsx>{`
        .film-strip {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: var(--film-strip-h);
          background: linear-gradient(180deg, transparent 0%, var(--color-velvet) 20%, var(--color-velvet) 80%, transparent 100%);
          border-top: 1px solid var(--color-film-edge);
          z-index: var(--z-film-strip);
          display: flex;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          overflow: hidden;
        }

        .film-strip::before,
        .film-strip::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          pointer-events: none;
          z-index: 1;
        }
        .film-strip::before {
          left: 0;
          background: linear-gradient(90deg, var(--color-velvet) 0%, transparent 100%);
        }
        .film-strip::after {
          right: 0;
          background: linear-gradient(270deg, var(--color-velvet) 0%, transparent 100%);
        }

        .strip-track {
          display: flex;
          align-items: center;
          gap: var(--film-frame-gap);
          padding: var(--space-sm) 0;
          width: max-content;
          will-change: transform;
        }

        .film-frame {
          position: relative;
          width: var(--film-frame-w);
          height: var(--film-frame-h);
          flex-shrink: 0;
          background: var(--color-film-edge);
          border: 2px solid var(--color-void);
          border-radius: var(--radius-sm);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-base);
          display: flex;
          flex-direction: column;
        }

        .film-frame::before,
        .film-frame::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 6px;
          background: repeating-linear-gradient(
            var(--color-void) 0,
            var(--color-void) 4px,
            transparent 4px,
            transparent 8px
          );
          opacity: 0.8;
        }
        .film-frame::before { left: 2px; }
        .film-frame::after { right: 2px; }

        .film-frame:hover {
          transform: scale(1.15) translateY(-8px);
          border-color: var(--color-projector);
          box-shadow: var(--shadow-projector);
          z-index: 10;
        }

        .film-frame.nav-frame {
          background: linear-gradient(135deg, var(--color-film-edge) 0%, var(--color-velvet) 100%);
        }

        .film-frame.nav-frame.active {
          border-color: var(--color-projector);
          background: linear-gradient(135deg, var(--color-projector-dim) 0%, var(--color-velvet) 100%);
        }

        .film-frame.nav-frame.active::before,
        .film-frame.nav-frame.active::after {
          background: repeating-linear-gradient(
            var(--color-projector) 0,
            var(--color-projector) 4px,
            transparent 4px,
            transparent 8px
          );
        }

        .frame-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xs);
          height: 100%;
          gap: 2px;
        }

        .frame-icon {
          font-size: 1.5rem;
          line-height: 1;
        }

        .frame-label {
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.06em;
          color: var(--color-silver-dim);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .film-frame.nav-frame.active .frame-label {
          color: var(--color-projector);
        }

        .frame-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .frame-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10, 10, 10, 0.9) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: var(--space-xs);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .film-frame:hover .frame-overlay {
          opacity: 1;
        }

        .frame-title {
          font-family: var(--font-display);
          font-size: 0.55rem;
          letter-spacing: 0.04em;
          color: var(--color-silver);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        .frame-meta {
          font-family: var(--font-mono);
          font-size: 0.5rem;
          color: var(--color-projector);
          letter-spacing: 0.02em;
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--color-film-edge);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-projector), #ffd43b);
          border-radius: 0 0 var(--radius-sm) var(--radius-sm);
          transform-origin: left;
          transform: scaleX(var(--scroll-progress, 0));
          transition: transform 0.1s linear;
        }

        .thumbnail-preview {
          position: fixed;
          bottom: calc(var(--film-strip-h) + var(--space-lg));
          left: 50%;
          transform: translateX(-50%) scale(0.9);
          width: 320px;
          background: var(--color-velvet);
          border: 1px solid var(--color-projector);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-projector);
          padding: var(--space-md);
          opacity: 0;
          visibility: hidden;
          transition: all var(--transition-spring);
          z-index: calc(var(--z-film-strip) + 1);
          pointer-events: none;
        }

        .thumbnail-preview.visible {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) scale(1);
          pointer-events: auto;
        }

        .thumbnail-poster {
          width: 100%;
          aspect-ratio: 2/3;
          object-fit: cover;
          border-radius: var(--radius-md);
          margin-bottom: var(--space-sm);
        }

        .thumbnail-title {
          font-family: var(--font-display);
          font-size: 1rem;
          letter-spacing: 0.04em;
          color: var(--color-projector);
          margin-bottom: var(--space-xs);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .thumbnail-meta {
          font-family: var(--font-mono);
          font-size: var(--fs-micro);
          color: var(--color-silver-dim);
          display: flex;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .film-strip {
            height: auto;
            padding: var(--space-sm) var(--space-md);
          }
          .strip-track {
            gap: 4px;
          }
          .film-frame {
            width: 80px;
            height: 45px;
          }
          .frame-label {
            font-size: 0.5rem;
          }
          .thumbnail-preview {
            width: 90vw;
            max-width: 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .film-frame:hover {
            transform: none;
          }
        }

        .genre-tag {
          font-size: 0.45rem;
          font-weight: 500;
          padding: 1px 4px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .genre-tag[data-genre="action"] { background: rgba(229, 57, 53, 0.2); border: 1px solid #e53935; color: #e53935; }
        .genre-tag[data-genre="adventure"] { background: rgba(251, 140, 0, 0.2); border: 1px solid #fb8c00; color: #fb8c00; }
        .genre-tag[data-genre="comedy"] { background: rgba(253, 216, 53, 0.2); border: 1px solid #fdd835; color: #fdd835; }
        .genre-tag[data-genre="fantasy"] { background: rgba(30, 136, 229, 0.2); border: 1px solid #1e88e5; color: #1e88e5; }
        .genre-tag[data-genre="sci-fi"] { background: rgba(142, 36, 170, 0.2); border: 1px solid #8e24aa; color: #8e24aa; }
        .genre-tag[data-genre="drama"] { background: rgba(216, 27, 96, 0.2); border: 1px solid #d81b60; color: #d81b60; }
        .genre-tag[data-genre="horror"] { background: rgba(27, 27, 27, 0.2); border: 1px solid #1b1b1b; color: #fff; }
        .genre-tag[data-genre="thriller"] { background: rgba(198, 40, 40, 0.2); border: 1px solid #c62828; color: #c62828; }
        .genre-tag[data-genre="romance"] { background: rgba(236, 64, 122, 0.2); border: 1px solid #ec407a; color: #ec407a; }
        .genre-tag[data-genre="animation"] { background: rgba(67, 160, 71, 0.2); border: 1px solid #43a047; color: #43a047; }
        .genre-tag[data-genre="mystery"] { background: rgba(92, 107, 192, 0.2); border: 1px solid #5c6bc0; color: #5c6bc0; }
        .genre-tag[data-genre="crime"] { background: rgba(55, 71, 79, 0.2); border: 1px solid #37474f; color: #fff; }
        .genre-tag[data-genre="documentary"] { background: rgba(0, 137, 123, 0.2); border: 1px solid #00897b; color: #00897b; }
        .genre-tag[data-genre="family"] { background: rgba(240, 98, 146, 0.2); border: 1px solid #f06292; color: #f06292; }
        .genre-tag[data-genre="music"] { background: rgba(171, 71, 188, 0.2); border: 1px solid #ab47bc; color: #ab47bc; }
        .genre-tag[data-genre="war"] { background: rgba(93, 64, 55, 0.2); border: 1px solid #5d4037; color: #5d4037; }
        .genre-tag[data-genre="western"] { background: rgba(191, 54, 12, 0.2); border: 1px solid #bf360c; color: #bf360c; }
        .genre-tag[data-genre="history"] { background: rgba(62, 39, 35, 0.2); border: 1px solid #3e2723; color: #3e2723; }
        .genre-tag[data-genre="biography"] { background: rgba(69, 90, 100, 0.2); border: 1px solid #455a64; color: #455a64; }
        .genre-tag[data-genre="musical"] { background: rgba(194, 24, 91, 0.2); border: 1px solid #c2185b; color: #c2185b; }

        .genre-tag:hover {
          opacity: 0.9;
        }
      `}</style>

      <div
        className={`film-strip ${className}`}
        ref={stripRef}
        onMouseEnter={() => setShowThumbnails(true)}
        onMouseLeave={() => setShowThumbnails(false)}
        role="navigation"
        aria-label="Navegación principal y películas recientes"
      >
        <div className="progress-bar" aria-hidden="true">
          <div
            className="progress-fill"
            style={{ '--scroll-progress': scrollProgress } as React.CSSProperties}
          />
        </div>

        <div className="strip-track" ref={thumbRef}>
          {allFrames.map((frame) =>
            frame.type === 'nav' ? (
              <Link
                key={frame.key}
                href={frame.href}
                className={`film-frame nav-frame ${frame.isActive ? 'active' : ''}`}
                aria-current={frame.isActive ? 'page' : undefined}
                onMouseEnter={() => frame.isActive || setShowThumbnails(false)}
              >
                <div className="frame-content">
                  <span className="frame-icon" aria-hidden="true">{frame.icon}</span>
                  <span className="frame-label">{frame.label}</span>
                </div>
              </Link>
            ) : (
              <Link
                key={frame.key}
                href={`/create?edit=${frame.id}`}
                className="film-frame movie-frame"
                onMouseEnter={() => setShowThumbnails(true)}
                onMouseLeave={() => setShowThumbnails(false)}
              >
                <img
                  src={frame.poster}
                  alt={frame.title}
                  className="frame-poster"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 68"%3E%3Crect fill="%231E1E1E" width="120" height="68"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="10" fill="%23666"%3ESin imagen%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="frame-overlay">
                  <span className="frame-title">{frame.title}</span>
                  <span className="frame-meta">
                    {frame.year} • 
                    {frame.genres.slice(0, 2).map((g, i) => (
                      <span key={g} data-genre={getGenreKey(g)} className="genre-tag" style={{ marginRight: i < 1 ? '4px' : 0 }}>{g}</span>
                    ))}
                  </span>
                </div>
              </Link>
            )
          )}
          {movies.length === 0 && NAV_ITEMS.length === 4 && (
            <div className="film-frame nav-frame" style={{ opacity: 0.4 }}>
              <div className="frame-content">
                <span className="frame-icon" aria-hidden="true">🎬</span>
                <span className="frame-label">SIN PELÍCULAS</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {showThumbnails && movies.length > 0 && (
        <div
          className="thumbnail-preview visible"
          role="tooltip"
          aria-label="Vista previa de película"
        >
          <img
            src={movies[0].poster}
            alt={movies[0].title}
            className="thumbnail-poster"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480"%3E%3Crect fill="%231E1E1E" width="320" height="480"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%23666"%3ESin imagen%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="thumbnail-title">{movies[0].title}</div>
          <div className="thumbnail-meta">
            <span>{movies[0].year}</span>
            <span>⭐ {movies[0].rate}</span>
            <span>
              {(movies[0].genres || []).slice(0, 3).map((g, i) => (
                <span key={g} data-genre={getGenreKey(g)} className="genre-tag" style={{ marginRight: i < 2 ? '4px' : 0 }}>{g}</span>
              ))}
            </span>
          </div>
        </div>
      )}
    </>
  );
}