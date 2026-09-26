'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/components/ToastContainer';

interface Movie {
  _id: string;
  title: string;
  year: number;
  director: string;
  duration: string;
  genres: string[];
  rate: number;
  poster: string;
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchMovies = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/movies', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Error al cargar películas');
      }

      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      showToast('error', 'No se pudieron cargar las películas');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        '¿Estás seguro de que quieres eliminar esta película?'
      )
    ) {
      return;
    }

    setDeletingId(id);

    try {
      const res = await fetch(
        `http://localhost:3001/movies/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        throw new Error('Error al eliminar');
      }

      setMovies((prev) =>
        prev.filter((m) => m._id !== id)
      );

      showToast(
        'success',
        'Película eliminada correctamente'
      );
    } catch (error) {
      console.error('Error deleting movie:', error);

      showToast(
        'error',
        'No se pudo eliminar la película'
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="home-cinematic-page">

        <section
          className="home-cinematic-hero"
          aria-labelledby="loading-title"
        >
          <div className="home-cinematic-hero-inner">

            <div className="home-cinematic-kicker">
              <span className="home-cinematic-kicker-line" />
              CINE M2 · CATÁLOGO
            </div>

            <div
              className="home-cinematic-number"
              aria-hidden="true"
            >
              
            </div>

            <h1
              id="loading-title"
              className="home-cinematic-title"
            >
              Cargando catálogo...
            </h1>

            <p className="home-cinematic-subtitle">
              Preparando tu colección cinematográfica.
            </p>

            <div
              className="home-cinematic-divider"
              aria-hidden="true"
            />

          </div>
        </section>

        <main className="home-cinematic-content">

          <div
            className="movie-grid"
            role="list"
            aria-label="Películas cargando"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <article
                key={i}
                className="card skeleton-card"
                aria-hidden="true"
              >
                <div className="skeleton skeleton-poster" />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-meta" />
                <div className="skeleton skeleton-meta" />
                <div className="skeleton skeleton-meta" />
              </article>
            ))}
          </div>

        </main>

        <style jsx>{`

          .home-cinematic-page {
            min-height: 100vh;

            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(184, 148, 67, 0.08),
                transparent 38%
              ),
              var(--color-void, #090909);

            color:
              var(
                --color-silver,
                #e8e5df
              );
          }

          .home-cinematic-hero {
            position: relative;
            overflow: hidden;

            border-bottom:
              1px solid
              rgba(184, 148, 67, 0.2);

            background:
              linear-gradient(
                180deg,
                rgba(18, 14, 11, 0.98),
                rgba(9, 9, 9, 0.98)
              );
          }

          .home-cinematic-hero::before {
            content: '';

            position: absolute;
            inset: 0;

            pointer-events: none;

            background:
              linear-gradient(
                90deg,
                transparent 0%,
                rgba(184, 148, 67, 0.035) 50%,
                transparent 100%
              );
          }

          .home-cinematic-hero-inner {
            position: relative;
            z-index: 1;

            max-width: 1200px;
            margin: 0 auto;

            padding:
              90px
              32px
              80px;
          }

          .home-cinematic-kicker {
            display: flex;
            align-items: center;

            gap: 12px;

            margin-bottom: 28px;

            color:
              var(
                --color-projector,
                #d6b45c
              );

            font-size: 0.75rem;
            font-weight: 700;

            letter-spacing: 0.2em;
            text-transform: uppercase;
          }

          .home-cinematic-kicker-line {
            width: 38px;
            height: 1px;

            background:
              var(
                --color-projector,
                #d6b45c
              );
          }

          .home-cinematic-number {
            margin-bottom: 4px;

            color:
              rgba(
                214,
                180,
                92,
                0.42
              );

            font-family:
              var(
                --font-display,
                Georgia,
                serif
              );

            font-size:
              clamp(
                4rem,
                9vw,
                7rem
              );

            font-weight: 700;

            line-height: 0.8;

            letter-spacing: -0.05em;
          }

          /*
           * ==================================================
           * TÍTULO PRINCIPAL
           * DEGRADADO DORADO / AMARILLO
           * ==================================================
           */

          .home-cinematic-title {
            max-width: 900px;

            margin:
              18px
              0
              18px;

            background:
              linear-gradient(
                90deg,
                #f4d77a 0%,
                #d6b45c 35%,
                #fff0a8 55%,
                #c49a3a 100%
              );

            -webkit-background-clip: text;
            background-clip: text;

            -webkit-text-fill-color: transparent;
            color: transparent;

            font-family:
              var(
                --font-display,
                Georgia,
                serif
              );

            font-size:
              clamp(
                2.6rem,
                6vw,
                5.4rem
              );

            font-weight: 700;

            line-height: 0.98;

            letter-spacing: -0.03em;
          }

          .home-cinematic-subtitle {
            max-width: 680px;

            margin: 0;

            color:
              rgba(
                232,
                229,
                223,
                0.68
              );

            font-size: 1.05rem;

            line-height: 1.8;
          }

          .home-cinematic-divider {
            width: 100%;
            max-width: 700px;

            height: 1px;

            margin-top: 38px;

            background:
              linear-gradient(
                90deg,
                var(
                  --color-projector,
                  #d6b45c
                ),
                rgba(
                  214,
                  180,
                  92,
                  0
                )
              );
          }

          .home-cinematic-content {
            max-width: 1200px;

            margin: 0 auto;

            padding:
              56px
              32px
              90px;
          }

          @media (max-width: 700px) {

            .home-cinematic-hero-inner {
              padding:
                65px
                20px
                55px;
            }

            .home-cinematic-content {
              padding:
                40px
                20px
                65px;
            }

            .home-cinematic-title {
              font-size:
                clamp(
                  2.4rem,
                  12vw,
                  4rem
                );
            }
          }

        `}</style>
      </div>
    );
  }

  /* ============================================================
     PÁGINA PRINCIPAL
  ============================================================ */

  return (
    <div className="home-cinematic-page">

      {/* ======================================================
          HERO
      ====================================================== */}

      <section
        className="home-cinematic-hero"
        aria-labelledby="hero-title"
      >
        <div className="home-cinematic-hero-inner">

          <div className="home-cinematic-kicker">
            <span className="home-cinematic-kicker-line" />
            CINE M2 · CATÁLOGO
          </div>

          <div
            className="home-cinematic-number"
            aria-hidden="true"
          >
            
          </div>

          <h1
            id="hero-title"
            className="home-cinematic-title"
          >
            Catálogo de Películas
          </h1>

          <p className="home-cinematic-subtitle">
            Explora tu colección personal.{' '}
            {movies.length} película
            {movies.length !== 1 ? 's' : ''}{' '}
            disponible
            {movies.length !== 1 ? 's' : ''}.
          </p>

          <div
            className="home-cinematic-divider"
            aria-hidden="true"
          />

          <Link
            href="/newMovie"
            className="home-cinematic-button"
          >
            <span>+</span>
            Nueva Película
          </Link>

        </div>
      </section>

      {/* ======================================================
          CONTENIDO
      ====================================================== */}

      <main className="home-cinematic-content">

        <section
          aria-labelledby="movies-heading"
          className="home-cinematic-collection"
        >

          {/* ==================================================
              ENCABEZADO COLECCIÓN
          ================================================== */}

          <div className="home-cinematic-section-header">

            <div>

              <div className="home-cinematic-section-kicker">
                TU ARCHIVO
              </div>

              <h2
                id="movies-heading"
                className="home-cinematic-section-title"
              >
                Tu Colección
              </h2>

            </div>

            <div className="home-cinematic-count">

              <span className="home-cinematic-count-number">
                {movies.length}
              </span>

              <span className="home-cinematic-count-label">
                título
                {movies.length !== 1 ? 's' : ''}
              </span>

            </div>

          </div>

          <div
            className="home-cinematic-section-line"
            aria-hidden="true"
          />

          {/* ==================================================
              ESTADO VACÍO
          ================================================== */}

          {movies.length === 0 ? (

            <div
              className="empty-state"
              role="status"
            >

              <div className="empty-state-icon">
                🎬
              </div>

              <h3 className="empty-state-title">
                No hay películas aún
              </h3>

              <p className="empty-state-text">
                Comenzá a construir tu colección
                agregando tu primera película.
              </p>

              <Link
                href="/newMovie"
                className="btn btn-primary mt-6"
              >
                Agregar Película
              </Link>

            </div>

          ) : (

            /* =================================================
               TARJETAS DE PELÍCULAS

               SE MANTIENE LA ESTRUCTURA ORIGINAL
            ================================================= */

            <div
              className="movie-grid"
              role="list"
              aria-label="Lista de películas"
            >

              {movies.map((movie) => (

                <article
                  key={movie._id}
                  className="card"
                  role="listitem"
                >

                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    className="card-poster"
                    loading="lazy"
                  />

                  <div className="card-body">

                    <h3 className="card-title">
                      {movie.title}
                    </h3>

                    <div className="card-meta">

                      <div className="card-meta-item">

                        <span className="card-meta-label">
                          Año:
                        </span>

                        <span className="card-meta-value">
                          {movie.year}
                        </span>

                      </div>

                      <div className="card-meta-item">

                        <span className="card-meta-label">
                          Director:
                        </span>

                        <span className="card-meta-value">
                          {movie.director}
                        </span>

                      </div>

                      <div className="card-meta-item">

                        <span className="card-meta-label">
                          Duración:
                        </span>

                        <span className="card-meta-value">
                          {movie.duration}
                        </span>

                      </div>

                      <div className="card-meta-item">

                        <span className="card-meta-label">
                          Puntaje:
                        </span>

                        <span className="card-meta-value">

                          <span className="rating">

                            <span
                              className="rating-star"
                              aria-hidden="true"
                            >
                              ★
                            </span>

                            {movie.rate}/10

                          </span>

                        </span>

                      </div>

                    </div>

                    <div
                      className="card-genres"
                      aria-label={`Géneros: ${movie.genres.join(
                        ', '
                      )}`}
                    >

                      {movie.genres.map((g) => {

                        console.log(
                          'Genero recibido:',
                          g
                        );

                        const mapGenres: Record<
                          string,
                          string
                        > = {

                          'acción': 'action',
                          'comedia': 'comedy',
                          'drama': 'drama',
                          'fantasía': 'fantasy',
                          'ciencia ficción': 'sci-fi',
                          'terror': 'horror',
                          'romance': 'romance',
                          'thriller': 'thriller',
                          'aventura': 'adventure',
                          'animación': 'animation',
                          'documental': 'documentary'

                        };

                        const normalized =
                          mapGenres[
                            g.toLowerCase()
                          ] ||
                          g.toLowerCase();

                        return (

                          <span
                            key={g}
                            className="genre-tag"
                            data-genre={normalized}
                          >
                            {g}
                          </span>

                        );
                      })}

                    </div>

                  </div>

                  <div className="card-footer">

                    <button
                      className="btn btn-danger btn-icon btn-sm"
                      onClick={() =>
                        handleDelete(movie._id)
                      }
                      disabled={
                        deletingId === movie._id
                      }
                      aria-label={`Eliminar ${movie.title}`}
                      aria-busy={
                        deletingId === movie._id
                      }
                    >

                      {deletingId === movie._id ? (

                        <svg
                          className="animate-spin"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >

                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            opacity="0.25"
                          />

                          <path
                            d="M22 12a10 10 0 0 1-10 10"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />

                        </svg>

                      ) : (

                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >

                          <path
                            d="M3 6H5H21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          <path
                            d="M10 11V17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                          <path
                            d="M14 11V17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />

                        </svg>

                      )}

                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* ======================================================
          ESTILOS EXCLUSIVOS DE ESTA PÁGINA
      ====================================================== */}

      <style jsx>{`

        .home-cinematic-page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(184, 148, 67, 0.07),
              transparent 35%
            ),
            var(--color-void, #090909);

          color:
            var(
              --color-silver,
              #e8e5df
            );
        }

        /* ====================================================
           HERO
        ==================================================== */

        .home-cinematic-hero {
          position: relative;
          overflow: hidden;

          border-bottom:
            1px solid
            rgba(184, 148, 67, 0.2);

          background:
            linear-gradient(
              180deg,
              rgba(20, 16, 12, 0.98),
              rgba(9, 9, 9, 0.98)
            );
        }

        .home-cinematic-hero::before {
          content: '';

          position: absolute;
          inset: 0;

          pointer-events: none;

          background:
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(184, 148, 67, 0.035) 50%,
              transparent 100%
            );
        }

        .home-cinematic-hero::after {
          content: '';

          position: absolute;

          left: 0;
          right: 0;
          bottom: 0;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              var(
                --color-projector,
                #d6b45c
              ),
              transparent
            );

          opacity: 0.35;
        }

        .home-cinematic-hero-inner {
          position: relative;
          z-index: 1;

          max-width: 1200px;

          margin: 0 auto;

          padding:
            90px
            32px
            80px;
        }

        .home-cinematic-kicker {
          display: flex;
          align-items: center;

          gap: 12px;

          margin-bottom: 28px;

          color:
            var(
              --color-projector,
              #d6b45c
            );

          font-size: 0.75rem;
          font-weight: 700;

          letter-spacing: 0.2em;

          text-transform: uppercase;
        }

        .home-cinematic-kicker-line {
          width: 38px;
          height: 1px;

          background:
            var(
              --color-projector,
              #d6b45c
            );
        }

        .home-cinematic-number {
          margin-bottom: 4px;

          color:
            rgba(
              214,
              180,
              92,
              0.42
            );

          font-family:
            var(
              --font-display,
              Georgia,
              serif
            );

          font-size:
            clamp(
              4rem,
              9vw,
              7rem
            );

          font-weight: 700;

          line-height: 0.8;

          letter-spacing: -0.05em;
        }

        /* ====================================================
           TÍTULO PRINCIPAL
           DEGRADADO DORADO
        ==================================================== */

        .home-cinematic-title {
          max-width: 900px;

          margin:
            18px
            0
            18px;

          background:
            linear-gradient(
              90deg,
              #f4d77a 0%,
              #d6b45c 35%,
              #fff0a8 55%,
              #c49a3a 100%
            );

          -webkit-background-clip: text;
          background-clip: text;

          -webkit-text-fill-color: transparent;
          color: transparent;

          font-family:
            var(
              --font-display,
              Georgia,
              serif
            );

          font-size:
            clamp(
              2.6rem,
              6vw,
              5.4rem
            );

          font-weight: 700;

          line-height: 0.98;

          letter-spacing: -0.03em;
        }

        .home-cinematic-subtitle {
          max-width: 680px;
          margin: 0 auto;

          font-family: var(--font-body);
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
          font-weight: 300;

          color: var(--color-silver-dim);
        }

        .home-cinematic-divider {
          width: 100%;
          max-width: 700px;

          height: 1px;

          margin-top: 38px;

          background:
            linear-gradient(
              90deg,
              var(
                --color-projector,
                #d6b45c
              ),
              rgba(
                214,
                180,
                92,
                0
              )
            );
        }

        /* ====================================================
           BOTÓN NUEVA PELÍCULA
        ==================================================== */

        .home-cinematic-button {
          display: inline-flex;

          align-items: center;

          gap: 12px;

          margin-top: 32px;

          padding:
            14px
            22px;

          border:
            1px solid
            var(
              --color-projector,
              #d6b45c
            );

          background:
            rgba(
              214,
              180,
              92,
              0.08
            );

          color:
            var(
              --color-projector,
              #d6b45c
            );

          text-decoration: none;

          font-size: 0.85rem;
          font-weight: 700;

          letter-spacing: 0.08em;

          text-transform: uppercase;

          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .home-cinematic-button span {
          font-size: 1.25rem;
          line-height: 1;
        }

        .home-cinematic-button:hover {
          background:
            var(
              --color-projector,
              #d6b45c
            );

          color: #111;

          transform:
            translateY(-2px);

          box-shadow:
            0 8px 25px
            rgba(
              0,
              0,
              0,
              0.25
            );
        }

        /* ====================================================
           CONTENIDO
        ==================================================== */

        .home-cinematic-content {
          max-width: 1200px;

          margin: 0 auto;

          padding:
            58px
            32px
            90px;
        }

        .home-cinematic-collection {
          width: 100%;
        }

        /* ====================================================
           HEADER COLECCIÓN
        ==================================================== */

        .home-cinematic-section-header {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 30px;

          margin-bottom: 22px;
        }

        .home-cinematic-section-kicker {
          margin-bottom: 8px;

          color:
            var(
              --color-projector,
              #d6b45c
            );

          font-size: 0.7rem;

          font-weight: 700;

          letter-spacing: 0.2em;

          text-transform: uppercase;
        }

        .home-cinematic-section-title {
          margin: 0;

          color:
            var(
              --color-silver,
              #e8e5df
            );

          font-family:
            var(
              --font-display,
              Georgia,
              serif
            );

          font-size:
            clamp(
              2rem,
              4vw,
              3.2rem
            );

          line-height: 1;

          letter-spacing: -0.02em;
        }

        .home-cinematic-count {
          display: flex;

          align-items: baseline;

          gap: 8px;

          padding-bottom: 4px;

          color:
            rgba(
              232,
              229,
              223,
              0.6
            );
        }

        .home-cinematic-count-number {
          color:
            var(
              --color-projector,
              #d6b45c
            );

          font-family:
            var(
              --font-display,
              Georgia,
              serif
            );

          font-size: 1.8rem;

          font-weight: 700;
        }

        .home-cinematic-count-label {
          font-size: 0.8rem;

          letter-spacing: 0.08em;

          text-transform: uppercase;
        }

        .home-cinematic-section-line {
          width: 100%;

          height: 1px;

          margin-bottom: 38px;

          background:
            linear-gradient(
              90deg,
              rgba(
                214,
                180,
                92,
                0.55
              ),
              rgba(
                214,
                180,
                92,
                0.08
              ),
              transparent
            );
        }

        /* ====================================================
           RESPONSIVE
        ==================================================== */

        @media (max-width: 700px) {

          .home-cinematic-hero-inner {
            padding:
              65px
              20px
              55px;
          }

          .home-cinematic-content {
            padding:
              40px
              20px
              65px;
          }

          .home-cinematic-title {
            font-size:
              clamp(
                2.4rem,
                12vw,
                4rem
              );
          }

          .home-cinematic-section-header {
            align-items: flex-start;

            flex-direction: column;

            gap: 18px;
          }

          .home-cinematic-count {
            padding-bottom: 0;
          }

          .home-cinematic-button {
            width: 100%;

            justify-content: center;
          }
        }

        /* ====================================================
           REDUCIR ANIMACIONES
        ==================================================== */

        @media (prefers-reduced-motion: reduce) {

          .home-cinematic-button {
            transition: none;
          }

          .home-cinematic-button:hover {
            transform: none;
          }
        }

      `}</style>

    </div>
  );
}