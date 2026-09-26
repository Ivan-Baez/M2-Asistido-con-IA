'use client';

import { useState, useEffect, useRef } from 'react';
import { HISTORY_SECTIONS } from '../history/page';

export default function HistoriaCinePage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );

  const [progress, setProgress] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => {
              const next = new Set(prev);
              next.add(entry.target.id);
              return next;
            });
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    sectionRefs.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  const registerRef =
    (id: string) => (element: HTMLDivElement | null) => {
      if (element) {
        sectionRefs.current.set(id, element);

        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      } else {
        sectionRefs.current.delete(id);
      }
    };

  return (
    <>
      <style jsx>{`

        /* =========================================================
           CONTENEDOR GENERAL
        ========================================================= */

        .history-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--color-void);
          color: var(--color-silver);
        }

        /* =========================================================
           PROGRESO
        ========================================================= */

        .progress-ring {
          position: fixed;
          right: 28px;
          top: 50%;
          transform: translateY(-50%);
          width: 54px;
          height: 54px;
          z-index: 50;
          pointer-events: none;
          padding: 4px;
          border-radius: 50%;
          background: var(--color-velvet);
          border: 1px solid var(--color-film-edge);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
        }

        .progress-ring svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-ring-bg {
          fill: var(--color-velvet);
          stroke: var(--color-film-edge);
          stroke-width: 3;
        }

        .progress-ring-fill {
          fill: none;
          stroke: var(--color-projector);
          stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 138;
          stroke-dashoffset: calc(138 * (1 - var(--progress, 0)));
          transition: stroke-dashoffset 0.15s linear;
        }

        .progress-ring-label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: var(--color-projector);
        }

        /* =========================================================
           HERO
        ========================================================= */

        .hero {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;

          min-height: 430px;
          padding: 80px 24px;

          text-align: center;

          background: var(--color-void);

          border-bottom: 1px solid var(--color-film-edge);
        }

        .hero-content {
          width: 100%;
          max-width: 900px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding: 8px 18px;

          border: 1px solid var(--color-projector);
          border-radius: 999px;

          background: var(--color-velvet);

          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          color: var(--color-projector);

          text-transform: uppercase;

          margin-bottom: 28px;
        }

        .hero-title {
          margin: 0 0 20px;

          font-family: var(--font-display);
          font-size: clamp(3.5rem, 8vw, 7rem);
          line-height: 0.95;
          font-weight: 700;
          letter-spacing: -0.03em;

          color: var(--color-silver);
        }

        .hero-title span {
          color: var(--color-projector);
        }

        .hero-subtitle {
          max-width: 680px;
          margin: 0 auto;

          font-family: var(--font-body);
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
          font-weight: 300;

          color: var(--color-silver-dim);
        }

        /* =========================================================
           CONTENEDOR DE SECCIONES
        ========================================================= */

        main {
          width: 100%;
        }

        /* =========================================================
           SECCIONES
        ========================================================= */

        .history-section {
          position: relative;

          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;

          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 70px;

          padding: 100px 0;

          border-bottom: 1px solid var(--color-film-edge);
        }

        .history-section:last-of-type {
          border-bottom: none;
        }

        /* =========================================================
           ALTERNANCIA
        ========================================================= */

        @media (min-width: 900px) {
          .history-section:nth-child(even) {
            grid-template-columns: 1fr 340px;
          }

          .history-section:nth-child(even) .section-sticky {
            order: 2;
          }

          .history-section:nth-child(even) .section-content {
            order: 1;
          }
        }

        /* =========================================================
           COLUMNA DE INFORMACIÓN
        ========================================================= */

        .section-sticky {
          position: sticky;
          top: 90px;
          height: fit-content;
        }

        .section-year {
          margin-bottom: 8px;

          font-family: var(--font-display);
          font-size: clamp(3.5rem, 6vw, 5.5rem);
          line-height: 0.9;
          font-weight: 700;
          letter-spacing: -0.04em;

          color: var(--color-projector);
        }

        .section-label {
          display: inline-block;

          margin-bottom: 24px;

          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;

          text-transform: uppercase;

          color: var(--color-silver-dim);
        }

        /* =========================================================
           IMAGEN
        ========================================================= */

        .section-image-wrapper {
          position: relative;

          width: 100%;
          aspect-ratio: 4 / 3;

          overflow: hidden;

          border-radius: 18px;
          border: 1px solid var(--color-film-edge);

          background: var(--color-velvet);

          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.25);

          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .section-image-wrapper:hover {
          border-color: var(--color-projector);

          box-shadow:
            0 18px 40px rgba(0, 0, 0, 0.35);
        }

        .section-image {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;

          filter: grayscale(0.15) contrast(1.05);

          transition:
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.4s ease;
        }

        .section-image-wrapper:hover .section-image {
          transform: scale(1.04);
          filter: grayscale(0) contrast(1);
        }

        /* =========================================================
           CONTENIDO
        ========================================================= */

        .section-content {
          display: flex;
          flex-direction: column;
          gap: 28px;

          padding-top: 8px;
        }

        .section-title {
          margin: 0 0 12px;

          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.1;
          font-weight: 700;

          letter-spacing: -0.02em;

          color: var(--color-silver);
        }

        .section-subtitle {
          margin: 0;

          font-family: var(--font-body);
          font-size: 1.1rem;
          line-height: 1.6;
          font-weight: 300;

          color: var(--color-silver-dim);
        }

        .section-text {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .section-text p {
          margin: 0;

          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.85;

          color: var(--color-silver);
        }

        .section-text p:first-of-type::first-letter {
          float: left;

          margin-right: 10px;

          font-family: var(--font-display);
          font-size: 3.5rem;
          line-height: 0.8;
          font-weight: 700;

          color: var(--color-projector);
        }

        /* =========================================================
           NOTA
        ========================================================= */

        .side-note {
          display: flex;
          align-items: flex-start;
          gap: 14px;

          margin-top: 8px;
          padding: 18px 20px;

          background: var(--color-velvet);

          border: 1px solid var(--color-film-edge);
          border-left: 3px solid var(--color-projector);

          border-radius: 10px;

          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
        }

        .side-note-icon {
          flex-shrink: 0;

          font-size: 1.1rem;
          line-height: 1.4;
        }

        .side-note-text {
          margin: 0;

          font-family: var(--font-mono);
          font-size: 0.8rem;
          line-height: 1.6;

          color: var(--color-silver-dim);
        }

        /* =========================================================
           DECORACIÓN ENTRE SECCIONES
        ========================================================= */

        .film-strip-decoration {
          position: absolute;

          left: 50%;
          bottom: -12px;

          transform: translateX(-50%);

          width: 70px;
          height: 24px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: var(--color-void);

          border: 1px solid var(--color-film-edge);
          border-radius: 5px;

          z-index: 2;
        }

        .film-strip-decoration span {
          width: 42px;
          height: 8px;

          background: var(--color-projector);

          border-radius: 2px;
        }

        /* =========================================================
           ANIMACIÓN DE ENTRADA
        ========================================================= */

        .reveal-item {
          transform: translateY(18px);

          transition:
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .history-section.visible .reveal-item {
          transform: translateY(0);
        }

        /* =========================================================
           FOOTER
        ========================================================= */

        .history-footer {
          width: min(900px, calc(100% - 48px));

          margin: 0 auto;

          padding: 100px 0;

          text-align: center;
        }

        .footer-title {
          margin: 0 0 12px;

          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 600;

          letter-spacing: 0.18em;

          color: var(--color-silver-dim);
        }

        .footer-text {
          margin: 0;

          font-family: var(--font-body);
          font-size: 0.95rem;

          color: var(--color-silver-muted);
        }

        /* =========================================================
           TABLET
        ========================================================= */

        @media (max-width: 899px) {
          .history-section {
            grid-template-columns: 1fr;

            gap: 40px;

            padding: 80px 0;
          }

          .section-sticky {
            position: relative;
            top: auto;
          }

          .section-image-wrapper {
            max-width: 650px;
          }
        }

        /* =========================================================
           MOBILE
        ========================================================= */

        @media (max-width: 768px) {

          .progress-ring {
            display: none;
          }

          .hero {
            min-height: 380px;
            padding: 70px 20px 60px;
          }

          .hero-badge {
            font-size: 9px;
            padding: 7px 14px;
            margin-bottom: 22px;
          }

          .hero-title {
            font-size: clamp(3rem, 15vw, 4.5rem);
          }

          .hero-subtitle {
            font-size: 0.95rem;
            line-height: 1.6;
          }

          .history-section {
            width: min(100% - 32px, 650px);

            padding: 65px 0;

            gap: 30px;
          }

          .section-year {
            font-size: 3.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-subtitle {
            font-size: 1rem;
          }

          .section-text p {
            font-size: 0.95rem;
            line-height: 1.75;
          }

          .section-image-wrapper {
            border-radius: 14px;
          }

          .side-note {
            padding: 16px;
          }

          .history-footer {
            width: calc(100% - 32px);
            padding: 70px 0;
          }
        }

        /* =========================================================
           ACCESIBILIDAD
        ========================================================= */

        @media (prefers-reduced-motion: reduce) {

          .reveal-item {
            transform: none;
            transition: none;
          }

          .section-image {
            transition: none;
          }

          .section-image-wrapper {
            transition: none;
          }

          .progress-ring-fill {
            transition: none;
          }
        }

      `}</style>

      <div className="history-page">

        {/* =====================================================
            PROGRESO
        ===================================================== */}

        <div
          className="progress-ring"
          aria-hidden="true"
          role="img"
          aria-label={`Progreso de lectura: ${Math.round(
            progress * 100
          )}%`}
        >
          <svg viewBox="0 0 48 48">

            <circle
              className="progress-ring-bg"
              cx="24"
              cy="24"
              r="21"
            />

            <circle
              className="progress-ring-fill"
              cx="24"
              cy="24"
              r="21"
              style={
                {
                  '--progress': progress,
                } as React.CSSProperties
              }
            />

          </svg>

          <div className="progress-ring-label">
            {Math.round(progress * 100)}%
          </div>
        </div>

        {/* =====================================================
            HERO
        ===================================================== */}

        <header
          className="hero"
          aria-labelledby="history-title"
        >
          <div className="hero-content">

            <div
              className="hero-badge"
              aria-hidden="true"
            >
              HISTORIA DEL CINE
            </div>

            <h1
              id="history-title"
              className="hero-title"
            >
              Historia del <span>Cine</span>
            </h1>

            <p className="hero-subtitle">
              Un recorrido por los grandes momentos que
              transformaron el séptimo arte y cambiaron
              para siempre nuestra forma de contar historias.
            </p>

          </div>
        </header>

        {/* =====================================================
            CONTENIDO
        ===================================================== */}

        <main>

          {HISTORY_SECTIONS.map((section, index) => (

            <article
              key={section.id}
              id={section.id}
              ref={registerRef(section.id)}
              className={`history-section ${
                visibleSections.has(section.id)
                  ? 'visible'
                  : ''
              }`}
              aria-labelledby={`${section.id}-title`}
            >

              {/* =================================================
                  INFORMACIÓN + IMAGEN
              ================================================= */}

              <div className="section-sticky reveal-item">

                <div className="section-year">
                  {section.year}
                </div>

                <span className="section-label">
                  {section.label}
                </span>

                <div className="section-image-wrapper">

                  <img
                    src={section.image}
                    alt={section.alt}
                    className="section-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%231E1E1E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="20" fill="%23666"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                    }}
                  />

                </div>

              </div>

              {/* =================================================
                  CONTENIDO
              ================================================= */}

              <div className="section-content">

                <header className="reveal-item">

                  <h2
                    id={`${section.id}-title`}
                    className="section-title"
                  >
                    {section.title}
                  </h2>

                  <p className="section-subtitle">
                    {section.subtitle}
                  </p>

                </header>

                <div className="section-text">

                  {section.content.map(
                    (paragraph, i) => (

                      <p
                        key={i}
                        className="reveal-item"
                      >
                        {paragraph}
                      </p>

                    )
                  )}

                </div>

                {/* =================================================
                    NOTA
                ================================================= */}

                {section.sideNote && (

                  <aside className="side-note reveal-item">

                    <span
                      className="side-note-icon"
                      aria-hidden="true"
                    >
                      💡
                    </span>

                    <p className="side-note-text">
                      {section.sideNote}
                    </p>

                  </aside>

                )}

              </div>

              {/* =================================================
                  DECORACIÓN
              ================================================= */}

              {index < HISTORY_SECTIONS.length - 1 && (

                <div
                  className="film-strip-decoration"
                  aria-hidden="true"
                >
                  <span />
                </div>

              )}

            </article>

          ))}

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <footer className="history-footer">

            <p className="footer-title">
              FIN DE LA PROYECCIÓN
            </p>

            <p className="footer-text">
              El cine continúa. La próxima historia la escribes tú.
            </p>

          </footer>

        </main>

      </div>
    </>
  );
}