'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMovies, Movie, MoviesResponse } from '@/lib/api';
import MovieCard from './MovieCard';

interface MovieListProps {
  initialMovies?: Movie[];
  totalPages?: number;
}

export default function MovieList({ initialMovies = [], totalPages = 1 }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [pagination, setPagination] = useState<MoviesResponse['pagination'] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(!initialMovies.length);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!initialMovies.length) {
      fetchMovies(1);
    } else {
      setPagination({
        page: 1,
        limit: 12,
        totalPages,
        totalMovies: initialMovies.length,
        hasPrev: false,
        hasNext: totalPages > 1,
      });
    }
  }, [initialMovies.length, totalPages]);

  const fetchMovies = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMovies(page);
      setMovies(data.movies);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError('Error al cargar las películas');
      showToast('error', 'Error al cargar las películas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar');
      }

      showToast('success', 'Película eliminada correctamente');
      setMovies((prev) => prev.filter((m) => m._id !== id));
      if (pagination && movies.length === 1 && currentPage > 1) {
        fetchMovies(currentPage - 1);
      } else {
        fetchMovies(currentPage);
      }
    } catch (err) {
      showToast('error', 'Error al eliminar la película');
    }
  }, [currentPage, fetchMovies, movies.length, pagination]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      fetchMovies(page);
    }
  };

  if (!mounted) {
    return (
      <div className="movies-grid" aria-busy="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="movie-card skeleton" style={{ pointerEvents: 'none' }}>
            <div className="card-poster">
              <div className="absolute inset-0 bg-film-edge animate-pulse" />
            </div>
            <div className="card-body p-lg space-y-md">
              <div className="h-4 w-3/4 bg-film-edge animate-pulse rounded" />
              <div className="h-6 w-1/2 bg-film-edge animate-pulse rounded" />
              <div className="h-3 w-1/3 bg-film-edge animate-pulse rounded" />
              <div className="h-3 w-1/4 bg-film-edge animate-pulse rounded mt-auto" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isLoading && movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4xl text-center">
        <div className="text-projector display-font text-display mb-md">CARGANDO</div>
        <div className="w-12 h-12 border-4 border-film-edge border-t-projector rounded-full animate-spin" aria-hidden="true" />
        <p className="text-silver-muted mt-md mono-font text-small">Cargando catálogo...</p>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="text-center py-4xl">
        <div className="text-cut-red display-font text-display mb-md">ERROR</div>
        <p className="text-silver-dim mb-lg">{error}</p>
        <button className="btn btn-primary" onClick={() => fetchMovies(currentPage)}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-lg);
        }

        .skeleton {
          animation: none;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .toast-container {
          position: fixed;
          bottom: calc(var(--film-strip-h) + var(--space-xl));
          right: var(--space-lg);
          z-index: var(--z-toast);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          pointer-events: none;
        }

        .toast {
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-lg);
          font-size: var(--fs-small);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          animation: slideIn 0.3s var(--transition-spring);
          pointer-events: auto;
          box-shadow: var(--shadow-xl);
        }

        .toast-success {
          background: rgba(34, 197, 94, 0.95);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: var(--color-void);
        }

        .toast-error {
          background: rgba(192, 57, 43, 0.95);
          border: 1px solid var(--color-cut-red);
          color: var(--color-silver);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .pagination-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--space-lg);
          padding: var(--space-xl) 0;
          margin-top: var(--space-xl);
          border-top: 1px solid var(--color-film-edge);
        }

        .pagination-btn {
          padding: var(--space-sm) var(--space-xl);
          font-family: var(--font-display);
          font-size: var(--fs-small);
          letter-spacing: 0.06em;
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-info {
          font-family: var(--font-mono);
          font-size: var(--fs-small);
          color: var(--color-projector);
          min-width: 160px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .movies-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: var(--space-md);
          }
        }
      `}</style>

      {toast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
            <span aria-hidden="true">{toast.type === 'success' ? '✓' : '✕'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <section id="peliculas-container" className="movies-grid" aria-label="Lista de películas">
        {movies.length === 0 ? (
          <div className="col-span-full text-center py-4xl">
            <div className="text-projector display-font text-display mb-md">VACÍO</div>
            <p className="text-silver-dim">No hay películas para mostrar</p>
          </div>
        ) : (
          movies.map((movie) => (
            <div key={movie._id}>
              <MovieCard movie={movie} onDelete={handleDelete} />
            </div>
          ))
        )}
      </section>

      {pagination && pagination.totalPages > 1 && (
        <nav className="pagination-nav" aria-label="Paginación de películas">
          <button
            className="btn btn-secondary pagination-btn"
            disabled={!pagination.hasPrev}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Página anterior"
          >
            Anterior
          </button>
          <span className="page-info" aria-current="page">
            Página {currentPage} de {pagination.totalPages}
          </span>
          <button
            className="btn btn-primary pagination-btn"
            disabled={!pagination.hasNext}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Página siguiente"
          >
            Siguiente
          </button>
        </nav>
      )}
    </>
  );
}