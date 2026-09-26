'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Movie } from '@/lib/api';

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: string) => void;
  variant?: 'grid' | 'featured';
}

function getGenreKey(genre: string): string {
  return genre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function MovieCard({ movie, onDelete, variant = 'grid' }: MovieCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const genres = movie.genres || [];
  const displayGenres = genres.slice(0, 3);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);
    try {
      await onDelete(movie._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  if (variant === 'featured') {
    return (
      <article className="card film-grain film-strip-perf overflow-hidden" style={{ minHeight: '400px' }}>
        <div style={{ position: 'relative', aspectRatio: '2/3' }}>
          <img
            src={movie.poster}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"%3E%3Crect fill="%231E1E1E" width="400" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="18" fill="%23666"%3ESin imagen%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" aria-hidden="true" />
<div className="absolute bottom-0 left-0 right-0 p-lg flex flex-col gap-sm">
              <div className="flex flex-wrap gap-xs">
                {displayGenres.map((genre) => (
                  <span key={genre} className="px-sm py-xs bg-projector-dim text-projector text-micro mono-font rounded-pill border border-projector/30" data-genre={getGenreKey(genre)}>
                    {genre}
                  </span>
                ))}
                {genres.length > 3 && (
                  <span className="px-sm py-xs bg-film-edge text-silver-muted text-micro mono-font rounded-pill">
                    +{genres.length - 3}
                  </span>
                )}
              </div>
            <div className="flex items-center gap-sm">
              <span className="display-font text-title text-projector">{movie.rate}</span>
              <span className="text-silver-muted mono-font text-small">/10</span>
              <span className="text-silver-muted mono-font text-micro">·</span>
              <span className="text-silver-muted mono-font text-small">{movie.year}</span>
            </div>
          </div>
        </div>
        <div className="p-xl flex flex-col">
          <span className="mono-font text-micro text-projector mb-sm">{movie.year}</span>
          <h3 className="display-font text-heading text-silver mb-md">{movie.title}</h3>
          <p className="text-silver-dim mb-lg flex-1">{movie.duration} · Dir. {movie.director}</p>
          <div className="flex items-center justify-between pt-md border-t border-film-edge">
            <Link
              href={`/create?edit=${movie._id}`}
              className="btn btn-ghost text-small"
              onClick={(e) => e.stopPropagation()}
            >
              Editar
            </Link>
            <button
              className="btn btn-danger text-small"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={`Eliminar ${movie.title}`}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <>
      <style jsx>{`
        .movie-card {
          background: var(--color-velvet);
          border: 1px solid var(--color-film-edge);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all var(--transition-base);
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .movie-card:hover {
          border-color: var(--color-projector);
          box-shadow: var(--shadow-lg);
          transform: translateY(-6px);
        }

        .card-poster {
          position: relative;
          aspect-ratio: 2/3;
          overflow: hidden;
        }

        .card-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .movie-card:hover .card-poster img {
          transform: scale(1.05);
        }

        .poster-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(10, 10, 10, 0.8) 100%);
          opacity: 0;
          transition: opacity var(--transition-base);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          padding: var(--space-md);
          gap: var(--space-xs);
        }

        .movie-card:hover .poster-overlay {
          opacity: 1;
        }

        .rating-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-projector);
          color: var(--color-void);
          font-family: var(--font-display);
          font-size: var(--fs-small);
          border-radius: var(--radius-pill);
          font-weight: 600;
        }

        .rating-badge::before {
          content: '★';
          font-size: 0.9em;
        }

        .year-badge {
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-film-edge);
          color: var(--color-silver-dim);
          font-family: var(--font-mono);
          font-size: var(--fs-micro);
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-velvet);
        }

        .card-body {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-genres {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-xs);
          margin-bottom: var(--space-md);
        }

        .genre-tag {
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-projector-dim);
          color: var(--color-projector);
          font-family: var(--font-mono);
          font-size: var(--fs-micro);
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-projector);
          transition: all var(--transition-fast);
        }

        .genre-tag:hover {
          background: var(--color-projector);
          color: var(--color-void);
        }

        .genre-more {
          padding: var(--space-xs) var(--space-sm);
          background: var(--color-film-edge);
          color: var(--color-silver-muted);
          font-family: var(--font-mono);
          font-size: var(--fs-micro);
          border-radius: var(--radius-pill);
        }

        .card-title {
          font-family: var(--font-display);
          font-size: var(--fs-heading);
          color: var(--color-silver);
          margin-bottom: var(--space-xs);
          letter-spacing: 0.02em;
          line-height: 1.2;
        }

        .card-meta {
          font-family: var(--font-mono);
          font-size: var(--fs-micro);
          color: var(--color-silver-muted);
          margin-bottom: var(--space-md);
        }

        .card-director {
          color: var(--color-silver-dim);
          font-family: var(--font-body);
          font-size: var(--fs-small);
          margin-bottom: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--color-film-edge);
        }

        .card-director strong {
          color: var(--color-projector);
        }

        .card-actions {
          display: flex;
          gap: var(--space-sm);
          padding-top: var(--space-md);
          border-top: 1px solid var(--color-film-edge);
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xs);
          padding: var(--space-sm) var(--space-md);
          font-family: var(--font-body);
          font-size: var(--fs-micro);
          font-weight: 600;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .action-edit {
          background: transparent;
          color: var(--color-silver);
          border: 1px solid var(--color-film-edge);
        }

        .action-edit:hover {
          background: var(--color-film-edge);
          border-color: var(--color-projector);
          color: var(--color-projector);
        }

        .action-delete {
          background: transparent;
          color: var(--color-cut-red);
          border: 1px solid var(--color-cut-red);
        }

        .action-delete:hover {
          background: var(--color-cut-red);
          color: var(--color-silver);
          box-shadow: var(--shadow-cut);
        }

        .action-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .confirm-dialog {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal);
          padding: var(--space-lg);
          animation: fadeIn var(--transition-base);
        }

        .confirm-box {
          background: var(--color-velvet);
          border: 1px solid var(--color-cut-red);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          max-width: 400px;
          width: 100%;
          animation: slideUp var(--transition-spring);
        }

        .confirm-title {
          font-family: var(--font-display);
          font-size: var(--fs-heading);
          color: var(--color-cut-red);
          margin-bottom: var(--space-md);
        }

        .confirm-text {
          color: var(--color-silver-dim);
          margin-bottom: var(--space-xl);
        }

        .confirm-actions {
          display: flex;
          gap: var(--space-md);
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .card-title {
            font-size: var(--fs-body);
          }
          .action-btn span {
            display: none;
          }
          .action-btn {
            padding: var(--space-sm);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .movie-card:hover {
            transform: none;
          }
          .movie-card:hover .card-poster img {
            transform: none;
          }
        }
      `}</style>

      <article className="movie-card" data-movie-id={movie._id}>
        <div className="card-poster">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"%3E%3Crect fill="%231E1E1E" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%23666"%3ESin imagen%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="poster-overlay">
            <span className="rating-badge">{movie.rate.toFixed(1)}</span>
            <span className="year-badge mono-font">{movie.year}</span>
          </div>
        </div>

        <div className="card-body">
          <div className="card-genres" role="list" aria-label="Géneros">
            {displayGenres.map((genre) => (
              <span key={genre} className="genre-tag" role="listitem" data-genre={getGenreKey(genre)}>{genre}</span>
            ))}
            {genres.length > 3 && (
              <span className="genre-more">+{genres.length - 3}</span>
            )}
          </div>

          <h3 className="card-title">{movie.title}</h3>
          <p className="card-meta mono-font">{movie.duration}</p>

          <p className="card-director">
            Dir. <strong>{movie.director}</strong>
          </p>

          <div className="card-actions">
            <Link
              href={`/create?edit=${movie._id}`}
              className="action-btn action-edit"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Editar ${movie.title}`}
            >
              <span aria-hidden="true">✏️</span>
              <span>Editar</span>
            </Link>
            <button
              className="action-btn action-delete"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label={`Eliminar ${movie.title}`}
            >
              <span aria-hidden="true">🗑️</span>
              <span>{isDeleting ? '...' : 'Eliminar'}</span>
            </button>
          </div>
        </div>

        {showConfirm && (
          <div className="confirm-dialog" onClick={cancelDelete} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
              <h3 id="confirm-title" className="confirm-title">Eliminar Película</h3>
              <p className="confirm-text">
                ¿Estás seguro de que quieres eliminar <strong>"{movie.title}"</strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="confirm-actions">
                <button className="btn btn-secondary" onClick={cancelDelete}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={confirmDelete} disabled={isDeleting}>
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
}