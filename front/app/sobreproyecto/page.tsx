'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SobreProyectoPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(
        documentHeight > 0
          ? Math.min(scrollTop / documentHeight, 1)
          : 0
      );
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <style jsx>{`

        /* =========================================================
           CONTENEDOR GENERAL
        ========================================================= */

        .project-page {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--color-void);
          color: var(--color-silver);
        }

        /* =========================================================
           INDICADOR DE PROGRESO
        ========================================================= */

        .progress-ring {
          position: fixed;
          right: 28px;
          top: 50%;

          width: 54px;
          height: 54px;

          transform: translateY(-50%);

          z-index: 50;

          padding: 4px;

          border-radius: 50%;
          border: 1px solid var(--color-film-edge);

          background: var(--color-velvet);

          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);

          pointer-events: none;
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

          stroke-dashoffset: calc(
            138 * (1 - var(--progress, 0))
          );

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

          color: var(--color-projector);
        }

        /* =========================================================
           HERO
        ========================================================= */

        .hero {
          width: 100%;

          min-height: 390px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 70px 24px 60px;

          text-align: center;

          border-bottom: 1px solid var(--color-film-edge);

          background: var(--color-void);
        }

        .hero-content {
          width: 100%;
          max-width: 850px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 24px;
          padding: 7px 16px;

          border: 1px solid var(--color-projector);
          border-radius: 999px;

          background: var(--color-velvet);

          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;

          letter-spacing: 0.16em;

          color: var(--color-projector);

          text-transform: uppercase;
        }

        .hero-title {
          margin: 0 0 18px;

          font-family: var(--font-display);

          font-size: clamp(
            3.2rem,
            8vw,
            6rem
          );

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

          font-size: clamp(
            0.95rem,
            2vw,
            1.15rem
          );

          line-height: 1.7;

          font-weight: 300;

          color: var(--color-silver-dim);
        }

        /* =========================================================
           CONTENEDOR PRINCIPAL
        ========================================================= */

        .project-content {
          width: min(
            1180px,
            calc(100% - 48px)
          );

          margin: 0 auto;
        }

        /* =========================================================
           SECCIONES
        ========================================================= */

        .project-section {
          position: relative;

          display: grid;

          grid-template-columns: 300px 1fr;

          gap: 70px;

          padding: 95px 0;

          border-bottom: 1px solid var(--color-film-edge);
        }

        .project-section:last-of-type {
          border-bottom: none;
        }

        /* =========================================================
           ALTERNANCIA
        ========================================================= */

        @media (min-width: 900px) {

          .project-section:nth-child(even) {
            grid-template-columns: 1fr 300px;
          }

          .project-section:nth-child(even)
          .section-intro {
            order: 2;
          }

          .project-section:nth-child(even)
          .section-content {
            order: 1;
          }

        }

        /* =========================================================
           COLUMNA IZQUIERDA
        ========================================================= */

        .section-intro {
          position: sticky;

          top: 90px;

          height: fit-content;
        }

        .section-number {
          margin-bottom: 10px;

          font-family: var(--font-display);

          font-size: clamp(
            4rem,
            7vw,
            6rem
          );

          line-height: 0.85;

          font-weight: 700;

          letter-spacing: -0.05em;

          color: var(--color-projector);
        }

        .section-label {
          display: block;

          margin-bottom: 22px;

          font-family: var(--font-display);

          font-size: 10px;

          font-weight: 600;

          letter-spacing: 0.15em;

          text-transform: uppercase;

          color: var(--color-silver-dim);
        }

        .section-description {
          margin: 0;

          font-family: var(--font-body);

          font-size: 0.9rem;

          line-height: 1.7;

          color: var(--color-silver-muted);
        }

        /* =========================================================
           CONTENIDO
        ========================================================= */

        .section-content {
          min-width: 0;

          display: flex;
          flex-direction: column;

          gap: 28px;

          padding-top: 5px;
        }

        .section-title {
          margin: 0;

          font-family: var(--font-display);

          font-size: clamp(
            2rem,
            4vw,
            3rem
          );

          line-height: 1.1;

          font-weight: 700;

          letter-spacing: -0.02em;

          color: var(--color-silver);
        }

        .section-subtitle {
          margin: 10px 0 0;

          font-family: var(--font-body);

          font-size: 1rem;

          line-height: 1.6;

          color: var(--color-silver-dim);
        }

        .section-text {
          display: flex;
          flex-direction: column;

          gap: 18px;
        }

        .section-text p {
          margin: 0;

          font-family: var(--font-body);

          font-size: 0.98rem;

          line-height: 1.85;

          color: var(--color-silver);
        }

        .section-text p:first-of-type::first-letter {
          float: left;

          margin-right: 9px;

          font-family: var(--font-display);

          font-size: 3.3rem;

          line-height: 0.8;

          font-weight: 700;

          color: var(--color-projector);
        }

        /* =========================================================
           TECNOLOGÍAS
        ========================================================= */

        .tech-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 16px;
        }

        .tech-card {
          padding: 20px;

          border: 1px solid var(--color-film-edge);

          border-radius: 12px;

          background: var(--color-velvet);

          transition:
            border-color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .tech-card:hover {
          transform: translateY(-3px);

          border-color: var(--color-projector);

          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.25);
        }

        .tech-title {
          display: flex;
          align-items: center;

          gap: 10px;

          margin: 0 0 14px;

          font-family: var(--font-display);

          font-size: 1rem;

          color: var(--color-projector);
        }

        .tech-icon {
          width: 20px;
          height: 20px;

          flex-shrink: 0;
        }

        .tech-list {
          margin: 0;
          padding: 0;

          list-style: none;
        }

        .tech-list li {
          position: relative;

          padding-left: 15px;

          margin-bottom: 7px;

          font-family: var(--font-body);

          font-size: 0.8rem;

          line-height: 1.5;

          color: var(--color-silver-dim);
        }

        .tech-list li::before {
          content: '•';

          position: absolute;

          left: 0;

          color: var(--color-projector);
        }

        /* =========================================================
           ENDPOINTS
        ========================================================= */

        .api-list {
          display: flex;
          flex-direction: column;

          border: 1px solid var(--color-film-edge);

          border-radius: 12px;

          overflow: hidden;

          background: var(--color-velvet);
        }

        .api-row {
          display: grid;

          grid-template-columns: 80px 1fr;

          gap: 18px;

          padding: 16px 18px;

          border-bottom: 1px solid var(--color-film-edge);

          font-family: var(--font-mono);

          font-size: 0.78rem;
        }

        .api-row:last-child {
          border-bottom: none;
        }

        .api-method {
          font-weight: 700;
          color: var(--color-projector);
        }

        .api-method.post {
          color: #7fcf8a;
        }

        .api-method.delete {
          color: #e07b7b;
        }

        .api-route {
          color: var(--color-silver);
        }

        .api-description {
          display: block;

          margin-top: 4px;

          font-family: var(--font-body);

          font-size: 0.75rem;

          color: var(--color-silver-muted);
        }

        /* =========================================================
           CÓDIGO
        ========================================================= */

        .code-wrapper {
          overflow-x: auto;

          border: 1px solid var(--color-film-edge);

          border-radius: 12px;

          background: var(--color-velvet);

          box-shadow:
            0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .code-header {
          display: flex;
          align-items: center;

          gap: 7px;

          padding: 12px 16px;

          border-bottom: 1px solid var(--color-film-edge);
        }

        .code-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: var(--color-film-edge);
        }

        .code-label {
          margin-left: 7px;

          font-family: var(--font-mono);

          font-size: 0.7rem;

          color: var(--color-silver-muted);
        }

        .code-block {
          margin: 0;

          padding: 20px;

          min-width: 650px;

          font-family: var(--font-mono);

          font-size: 0.75rem;

          line-height: 1.7;

          color: var(--color-silver-dim);
        }

        /* =========================================================
           EJECUCIÓN
        ========================================================= */

        .steps {
          display: flex;
          flex-direction: column;

          gap: 16px;
        }

        .step {
          display: grid;

          grid-template-columns: 38px 1fr;

          gap: 15px;

          align-items: start;
        }

        .step-number {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid var(--color-projector);

          border-radius: 50%;

          font-family: var(--font-display);

          font-size: 0.75rem;
          font-weight: 700;

          color: var(--color-projector);
        }

        .step-content {
          padding-top: 5px;

          font-family: var(--font-body);

          font-size: 0.9rem;

          line-height: 1.7;

          color: var(--color-silver-dim);
        }

        .step-content strong {
          color: var(--color-silver);
        }

        .command {
          display: inline-block;

          margin-top: 5px;

          padding: 4px 8px;

          border: 1px solid var(--color-film-edge);

          border-radius: 5px;

          background: var(--color-void);

          font-family: var(--font-mono);

          font-size: 0.72rem;

          color: var(--color-projector);
        }

        /* =========================================================
           CARACTERÍSTICAS
        ========================================================= */

        .feature-list {
          display: flex;
          flex-direction: column;

          gap: 17px;

          margin: 0;
          padding: 0;

          list-style: none;
        }

        .feature-item {
          display: grid;

          grid-template-columns: 24px 1fr;

          gap: 12px;

          align-items: start;

          font-family: var(--font-body);

          font-size: 0.9rem;

          line-height: 1.7;

          color: var(--color-silver-dim);
        }

        .feature-icon {
          width: 20px;
          height: 20px;

          margin-top: 2px;

          color: var(--color-projector);
        }

        .feature-item strong {
          color: var(--color-silver);
        }

        /* =========================================================
           BOTÓN FINAL
        ========================================================= */

        .project-footer {
          padding: 85px 0 100px;

          text-align: center;
        }

        .footer-label {
          margin: 0 0 10px;

          font-family: var(--font-display);

          font-size: 0.7rem;

          font-weight: 600;

          letter-spacing: 0.18em;

          color: var(--color-silver-dim);
        }

        .footer-text {
          margin: 0 0 28px;

          font-family: var(--font-body);

          font-size: 0.9rem;

          color: var(--color-silver-muted);
        }

        .back-button {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          padding: 11px 20px;

          border: 1px solid var(--color-projector);

          border-radius: 8px;

          background: var(--color-velvet);

          font-family: var(--font-display);

          font-size: 0.75rem;

          font-weight: 600;

          letter-spacing: 0.05em;

          color: var(--color-projector);

          text-decoration: none;

          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .back-button:hover {
          transform: translateY(-2px);

          background: var(--color-projector);

          color: var(--color-void);
        }

        /* =========================================================
           RESPONSIVE
        ========================================================= */

        @media (max-width: 899px) {

          .project-section {
            grid-template-columns: 1fr;

            gap: 35px;

            padding: 75px 0;
          }

          .section-intro {
            position: relative;

            top: auto;
          }

          .section-number {
            font-size: 4rem;
          }

          .tech-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 768px) {

          .progress-ring {
            display: none;
          }

          .hero {
            min-height: 350px;

            padding:
              60px
              20px
              55px;
          }

          .hero-title {
            font-size: clamp(
              3rem,
              15vw,
              4.5rem
            );
          }

          .hero-subtitle {
            font-size: 0.9rem;
          }

          .project-content {
            width: calc(100% - 32px);
          }

          .project-section {
            padding: 60px 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-text p {
            font-size: 0.9rem;
          }

          .api-row {
            grid-template-columns: 65px 1fr;

            gap: 10px;

            padding: 14px;
          }

          .code-block {
            font-size: 0.68rem;
          }

          .project-footer {
            padding: 65px 0 75px;
          }

        }

        @media (prefers-reduced-motion: reduce) {

          .tech-card,
          .back-button {
            transition: none;
          }

        }

      `}</style>

      <div className="project-page">

        {/* =====================================================
            PROGRESO
        ===================================================== */}

        <div
          className="progress-ring"
          aria-hidden="true"
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

        <header className="hero">

          <div className="hero-content">

            <div className="hero-badge">
              CINE M2 · PROYECTO
            </div>

            <h1 className="hero-title">
              Sobre el <span>Proyecto</span>
            </h1>

            <p className="hero-subtitle">
              Detalles técnicos, arquitectura y decisiones
              de diseño de Cine M2.
            </p>

          </div>

        </header>

        <main className="project-content">

          {/* =====================================================
              01 · DESCRIPCIÓN
          ===================================================== */}

          <section
            className="project-section"
            aria-labelledby="about-heading"
          >

            <div className="section-intro">

              <div className="section-number">
                01
              </div>

              <span className="section-label">
                El proyecto
              </span>

              <p className="section-description">
                Una aplicación full-stack desarrollada
                durante el Módulo 2.
              </p>

            </div>

            <div className="section-content">

              <div>

                <h2
                  id="about-heading"
                  className="section-title"
                >
                  Descripción
                </h2>

                <p className="section-subtitle">
                  Catálogo personal de películas conectado
                  a una API REST.
                </p>

              </div>

              <div className="section-text">

                <p>
                  Cine M2 es una aplicación full-stack para
                  gestionar un catálogo personal de películas.
                  Permite visualizar, agregar y eliminar
                  películas almacenadas en una base de datos
                  MongoDB, todo a través de una interfaz
                  moderna y responsiva.
                </p>

                <p>
                  Desarrollado como proyecto del Módulo 2,
                  demuestra la integración entre un frontend
                  React/Next.js y un backend Express/MongoDB
                  comunicados vía API REST.
                </p>

              </div>

            </div>

          </section>

          {/* =====================================================
              02 · STACK
          ===================================================== */}

          <section
            className="project-section"
            aria-labelledby="stack-heading"
          >

            <div className="section-intro">

              <div className="section-number">
                02
              </div>

              <span className="section-label">
                Tecnologías
              </span>

              <p className="section-description">
                Las herramientas utilizadas para construir
                la aplicación.
              </p>

            </div>

            <div className="section-content">

              <div>

                <h2
                  id="stack-heading"
                  className="section-title"
                >
                  Stack Tecnológico
                </h2>

                <p className="section-subtitle">
                  Frontend, backend, testing y herramientas
                  de desarrollo.
                </p>

              </div>

              <div className="tech-grid">

                {/* FRONTEND */}

                <div className="tech-card">

                  <h3 className="tech-title">

                    <svg
                      className="tech-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>

                    Frontend

                  </h3>

                  <ul className="tech-list">

                    <li>
                      Next.js 14 (App Router)
                    </li>

                    <li>
                      React 18 + TypeScript
                    </li>

                    <li>
                      CSS Custom Properties
                    </li>

                    <li>
                      Fetch API nativo
                    </li>

                  </ul>

                </div>

                {/* BACKEND */}

                <div className="tech-card">

                  <h3 className="tech-title">

                    <svg
                      className="tech-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="2"
                      />

                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />

                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>

                    Backend

                  </h3>

                  <ul className="tech-list">

                    <li>
                      Express 5
                    </li>

                    <li>
                      Mongoose 8 (ODM MongoDB)
                    </li>

                    <li>
                      MongoDB (base de datos)
                    </li>

                    <li>
                      CORS + Morgan + dotenv
                    </li>

                  </ul>

                </div>

                {/* TESTING */}

                <div className="tech-card">

                  <h3 className="tech-title">

                    <svg
                      className="tech-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                      />

                      <line
                        x1="2"
                        y1="12"
                        x2="22"
                        y2="12"
                      />

                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>

                    Testing

                  </h3>

                  <ul className="tech-list">

                    <li>
                      Jest (chalannge-teasting)
                    </li>

                    <li>
                      Pruebas unitarias de peliculas
                    </li>

                  </ul>

                </div>

                {/* DEVOPS */}

                <div className="tech-card">

                  <h3 className="tech-title">

                    <svg
                      className="tech-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />

                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />

                      <line
                        x1="12"
                        y1="22.08"
                        x2="12"
                        y2="12"
                      />
                    </svg>

                    DevOps / DX

                  </h3>

                  <ul className="tech-list">

                    <li>
                      ESLint + TypeScript strict
                    </li>

                    <li>
                      Next.js build optimizado
                    </li>

                    <li>
                      Nodemon (dev backend)
                    </li>

                  </ul>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              03 · API
          ===================================================== */}

          <section
            className="project-section"
            aria-labelledby="api-heading"
          >

            <div className="section-intro">

              <div className="section-number">
                03
              </div>

              <span className="section-label">
                Backend
              </span>

              <p className="section-description">
                Comunicación mediante una API REST.
              </p>

            </div>

            <div className="section-content">

              <div>

                <h2
                  id="api-heading"
                  className="section-title"
                >
                  API Endpoints
                </h2>

                <p className="section-subtitle">
                  El backend expone los siguientes endpoints
                  REST.
                </p>

              </div>

              <div className="api-list">

                <div className="api-row">

                  <span className="api-method">
                    GET
                  </span>

                  <div>

                    <span className="api-route">
                      /movies
                    </span>

                    <span className="api-description">
                      Obtener todas las películas
                    </span>

                  </div>

                </div>

                <div className="api-row">

                  <span className="api-method post">
                    POST
                  </span>

                  <div>

                    <span className="api-route">
                      /movies
                    </span>

                    <span className="api-description">
                      Crear nueva película
                    </span>

                  </div>

                </div>

                <div className="api-row">

                  <span className="api-method delete">
                    DELETE
                  </span>

                  <div>

                    <span className="api-route">
                      /movies/:id
                    </span>

                    <span className="api-description">
                      Eliminar película por ID
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              04 · ESTRUCTURA
          ===================================================== */}

          <section
            className="project-section"
            aria-labelledby="structure-heading"
          >

            <div className="section-intro">

              <div className="section-number">
                04
              </div>

              <span className="section-label">
                Arquitectura
              </span>

              <p className="section-description">
                Organización interna del proyecto.
              </p>

            </div>

            <div className="section-content">

              <div>

                <h2
                  id="structure-heading"
                  className="section-title"
                >
                  Estructura del Proyecto
                </h2>

                <p className="section-subtitle">
                  Separación entre frontend, backend,
                  servicios y configuración.
                </p>

              </div>

              <div className="code-wrapper">

                <div className="code-header">

                  <span className="code-dot" />
                  <span className="code-dot" />
                  <span className="code-dot" />

                  <span className="code-label">
                    PM2-Ivan-Baez
                  </span>

                </div>

                <pre className="code-block">
{`PM2-Ivan-Baez/
├── back/                 # Backend Express + MongoDB
│   ├── src/
│   │   ├── config/       # Conexión BD (conDb.js)
│   │   ├── controllers/  # Controladores (moviesController.js)
│   │   ├── models/       # Modelos Mongoose (movieModel.js)
│   │   ├── routes/       # Rutas API (moviesRouter.js)
│   │   └── services/     # Lógica de negocio (moviesService.js)
│   ├── index.js          # Entry point (puerto 3001)
│   └── .env              # Variables de entorno
├── front/                # Frontend Next.js 14
│   ├── app/
│   │   ├── page.tsx
│   │   ├── newMovie/page.tsx
│   │   ├── historiacine/page.tsx
│   │   └── sobreproyecto/page.tsx
│   ├── components/
│   ├── globals.css
│   └── next.config.js
└── chalannge-teasting/
    └── carritoCompras.test.js`}
                </pre>

              </div>

            </div>

          </section>

          {/* =====================================================
              05 · EJECUCIÓN
          ===================================================== */}

          <section
            className="project-section"
            aria-labelledby="run-heading"
          >

            <div className="section-intro">

              <div className="section-number">
                05
              </div>

              <span className="section-label">
                Desarrollo
              </span>

              <p className="section-description">
                Puesta en marcha del entorno local.
              </p>

            </div>

            <div className="section-content">

              <div>

                <h2
                  id="run-heading"
                  className="section-title"
                >
                  Cómo Ejecutar
                </h2>

                <p className="section-subtitle">
                  Pasos necesarios para ejecutar Cine M2
                  localmente.
                </p>

              </div>

              <div className="steps">

                <div className="step">

                  <span className="step-number">
                    1
                  </span>

                  <div className="step-content">

                    <strong>
                      Inicia MongoDB
                    </strong>

                    <br />

                    Localmente, utilizando el puerto
                    27017 por defecto.

                  </div>

                </div>

                <div className="step">

                  <span className="step-number">
                    2
                  </span>

                  <div className="step-content">

                    <strong>
                      Backend
                    </strong>

                    <br />

                    Ejecuta el servidor Express.

                    <br />

                    <span className="command">
                      cd back && npm install && npm start
                    </span>

                  </div>

                </div>

                <div className="step">

                  <span className="step-number">
                    3
                  </span>

                  <div className="step-content">

                    <strong>
                      Frontend
                    </strong>

                    <br />

                    Ejecuta la aplicación Next.js.

                    <br />

                    <span className="command">
                      cd front && npm install && npm run dev
                    </span>

                  </div>

                </div>

                <div className="step">

                  <span className="step-number">
                    4
                  </span>

                  <div className="step-content">

                    <strong>
                      Abrir aplicación
                    </strong>

                    <br />

                    <span className="command">
                      http://localhost:3000
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              06 · DISEÑO
          ===================================================== */}

          <section
            className="project-section"
            aria-labelledby="design-heading"
          >

            <div className="section-intro">

              <div className="section-number">
                06
              </div>

              <span className="section-label">
                Experiencia
              </span>

              <p className="section-description">
                Principios utilizados para construir
                la interfaz.
              </p>

            </div>

            <div className="section-content">

              <div>

                <h2
                  id="design-heading"
                  className="section-title"
                >
                  Características de Diseño
                </h2>

                <p className="section-subtitle">
                  Una interfaz pensada para mantener
                  coherencia visual y facilidad de uso.
                </p>

              </div>

              <ul className="feature-list">

                <li className="feature-item">

                  <svg
                    className="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  <div>
                    <strong>
                      Design System coherente:
                    </strong>{' '}
                    Tokens CSS para colores,
                    tipografía, espaciado, sombras
                    y transiciones.
                  </div>

                </li>

                <li className="feature-item">

                  <svg
                    className="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  <div>
                    <strong>
                      Tipografía cinematográfica:
                    </strong>{' '}
                    Playfair Display (display) +
                    Inter (body) + JetBrains Mono
                    (código).
                  </div>

                </li>

                <li className="feature-item">

                  <svg
                    className="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  <div>
                    <strong>
                      Accesibilidad (a11y):
                    </strong>{' '}
                    ARIA labels, focus visible,
                    contraste WCAG AA y reduced
                    motion.
                  </div>

                </li>

                <li className="feature-item">

                  <svg
                    className="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  <div>
                    <strong>
                      Responsive mobile-first:
                    </strong>{' '}
                    Breakpoints en 480px, 768px,
                    1024px y 1400px.
                  </div>

                </li>

                <li className="feature-item">

                  <svg
                    className="feature-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>

                  <div>
                    <strong>
                      Estados de carga:
                    </strong>{' '}
                    Skeletons animados, loading
                    states, empty states y toast
                    notifications.
                  </div>

                </li>

              </ul>

            </div>

          </section>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <footer className="project-footer">

            <p className="footer-label">
              FIN DEL PROYECTO
            </p>

            <p className="footer-text">
              Cine M2 · Desarrollo Full Stack
            </p>

            <Link
              href="/"
              className="back-button"
            >

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line
                  x1="19"
                  y1="12"
                  x2="5"
                  y2="12"
                />

                <polyline points="12 19 5 12 12 5" />
              </svg>

              Volver al Catálogo

            </Link>

          </footer>

        </main>

      </div>
    </>
  );
}