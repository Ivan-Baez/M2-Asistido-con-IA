'use client';

import Link from 'next/link';

const TECH_STACK = [
  { category: 'Frontend', items: ['Next.js 14 (App Router)', 'React 18', 'TypeScript 5', 'CSS Variables Design System'] },
  { category: 'Backend', items: ['Express 5', 'MongoDB + Mongoose', 'RESTful API', 'Validación de datos'] },
  { category: 'Estilos', items: ['CSS Variables', 'Design System propietario', 'Film Strip Signature', 'Animaciones CSS'] },
  { category: 'Herramientas', items: ['ESLint + Prettier', 'Git + GitHub', 'Vercel Deploy', 'MongoDB Atlas'] },
];

const FEATURES = [
  { icon: '🎬', title: 'Catálogo Dinámico', desc: 'Grid responsivo tipo contact sheet con paginación infinita y film strip interactivo.' },
  { icon: '✏️', title: 'CRUD Completo', desc: 'Crear, leer, editar y eliminar películas con validación en tiempo real y confirmaciones.' },
  { icon: '🎞️', title: 'Historia del Cine', desc: 'Scrollytelling inmersivo con 8 hitos históricos, imágenes de archivo y navegación por frames.' },
  { icon: '⚡', title: 'Rendimiento', desc: 'Server Components, fetch con cache control, skeleton loaders y transiciones suaves.' },
  { icon: '♿', title: 'Accesibilidad', desc: 'ARIA labels, focus visible, reduced motion, contraste WCAG AA, navegación por teclado.' },
  { icon: '🎨', title: 'Design System', desc: 'Paleta cinematográfica, tipografía Bebas Neue + Space Grotesk, variables CSS, dark mode nativo.' },
];

const TIMELINE = [
  { date: 'SEMANA 1', title: 'Fundamentos', desc: 'Setup Next.js 14, TypeScript, configuración de ESLint/Prettier, estructura de carpetas App Router.' },
  { date: 'SEMANA 2', title: 'Backend & API', desc: 'Express 5, MongoDB Atlas, Mongoose schemas, endpoints REST, validación y manejo de errores.' },
  { date: 'SEMANA 3', title: 'Frontend Core', desc: 'Design system CSS, Film Strip component, MovieCard/Grid, paginación, estados de carga.' },
  { date: 'SEMANA 4', title: 'Features Avanzadas', desc: 'Formulario crear/editar, validación, confirmación eliminación, toast notifications, SSR.' },
  { date: 'SEMANA 5', title: 'Historia & Polish', desc: 'Página Historia scrollytelling, About editorial, accesibilidad, testing, deploy Vercel.' },
];

export default function AboutPage() {
  return (
    <>
      <style jsx>{`
        .about-page {
          max-width: 900px;
          margin: 0 auto;
        }

        .page-hero {
          text-align: center;
          padding: var(--space-3xl) 0 var(--space-2xl);
          border-bottom: 1px solid var(--color-film-edge);
          margin-bottom: var(--space-3xl);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-xs) var(--space-md);
          background: var(--color-projector-dim);
          border: 1px solid var(--color-projector);
          border-radius: var(--radius-pill);
          font-family: var(--font-display);
          font-size: var(--fs-micro);
          letter-spacing: 0.12em;
          color: var(--color-projector);
          text-transform: uppercase;
          margin-bottom: var(--space-lg);
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: var(--fs-hero);
          line-height: 1;
          letter-spacing: 0.02em;
          color: var(--color-silver);
          margin-bottom: var(--space-md);
        }

        .hero-title span {
          color: var(--color-projector);
        }

        .hero-subtitle {
          font-family: var(--font-body);
          font-size: var(--fs-heading);
          font-weight: 300;
          color: var(--color-silver-dim);
          max-width: 600px;
          margin: 0 auto;
        }

        .section {
          margin-bottom: var(--space-3xl);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .section-number {
          font-family: var(--font-display);
          font-size: var(--fs-display);
          color: var(--color-projector);
          opacity: 0.3;
          letter-spacing: 0.04em;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: var(--fs-title);
          color: var(--color-silver);
          letter-spacing: 0.04em;
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-lg);
        }

        .tech-card {
          background: var(--color-velvet);
          border: 1px solid var(--color-film-edge);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          transition: all var(--transition-base);
        }

        .tech-card:hover {
          border-color: var(--color-projector);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .tech-category {
          font-family: var(--font-display);
          font-size: var(--fs-small);
          letter-spacing: 0.08em;
          color: var(--color-projector);
          text-transform: uppercase;
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-sm);
          border-bottom: 1px solid var(--color-film-edge);
        }

        .tech-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .tech-item {
          font-family: var(--font-mono);
          font-size: var(--fs-small);
          color: var(--color-silver-dim);
          padding-left: var(--space-md);
          position: relative;
        }

        .tech-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5em;
          width: 6px;
          height: 6px;
          background: var(--color-projector);
          border-radius: 50%;
          opacity: 0.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--space-lg);
        }

        .feature-card {
          background: var(--color-velvet);
          border: 1px solid var(--color-film-edge);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          transition: all var(--transition-base);
        }

        .feature-card:hover {
          border-color: var(--color-projector);
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .feature-icon {
          font-size: 2.5rem;
          line-height: 1;
        }

        .feature-title {
          font-family: var(--font-display);
          font-size: var(--fs-heading);
          color: var(--color-silver);
          letter-spacing: 0.02em;
        }

        .feature-desc {
          font-size: var(--fs-small);
          color: var(--color-silver-dim);
          line-height: 1.6;
          flex: 1;
        }

        .timeline {
          position: relative;
          padding-left: var(--space-xl);
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, var(--color-projector) 0%, var(--color-film-edge) 100%);
        }

        .timeline-item {
          position: relative;
          padding-bottom: var(--space-2xl);
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -26px;
          top: 0;
          width: 20px;
          height: 20px;
          background: var(--color-velvet);
          border: 3px solid var(--color-projector);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          box-shadow: 0 0 0 4px var(--color-velvet);
        }

        .timeline-marker::after {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--color-projector);
          border-radius: 50%;
        }

        .timeline-date {
          font-family: var(--font-display);
          font-size: var(--fs-micro);
          letter-spacing: 0.1em;
          color: var(--color-projector);
          text-transform: uppercase;
          margin-bottom: var(--space-xs);
        }

        .timeline-title {
          font-family: var(--font-display);
          font-size: var(--fs-heading);
          color: var(--color-silver);
          margin-bottom: var(--space-xs);
        }

        .timeline-desc {
          color: var(--color-silver-dim);
          font-size: var(--fs-small);
          line-height: 1.6;
        }

        .motivation-card {
          background: linear-gradient(135deg, var(--color-film-edge) 0%, var(--color-velvet) 100%);
          border: 1px solid var(--color-projector);
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          position: relative;
          overflow: hidden;
        }

        .motivation-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, var(--color-projector-dim) 0%, transparent 70%);
          pointer-events: none;
        }

        .motivation-quote {
          font-family: var(--font-display);
          font-size: var(--fs-heading);
          color: var(--color-silver);
          line-height: 1.3;
          margin-bottom: var(--space-lg);
          position: relative;
          z-index: 1;
        }

        .motivation-quote span {
          color: var(--color-projector);
        }

        .motivation-text {
          color: var(--color-silver-dim);
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }

        .motivation-text p {
          margin-bottom: var(--space-md);
        }

        .structure-block {
          background: var(--color-void);
          border: 1px solid var(--color-film-edge);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: var(--fs-micro);
          line-height: 1.8;
          color: var(--color-silver-dim);
        }

        .structure-block span.keyword { color: var(--color-projector); }
        .structure-block span.comment { color: var(--color-silver-muted); }
        .structure-block span.string { color: #4ade80; }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
        }

        .link-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: var(--color-velvet);
          border: 1px solid var(--color-film-edge);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .link-card:hover {
          border-color: var(--color-projector);
          background: var(--color-projector-dim);
          transform: translateX(4px);
        }

        .link-icon {
          font-size: 1.5rem;
        }

        .link-text {
          font-family: var(--font-body);
          font-size: var(--fs-small);
          font-weight: 500;
          color: var(--color-silver);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(2.5rem, 14vw, 4rem);
          }
          .hero-subtitle {
            font-size: var(--fs-body);
          }
          .timeline {
            padding-left: var(--space-lg);
          }
          .timeline-marker {
            left: -22px;
            width: 16px;
            height: 16px;
            border-width: 2px;
          }
        }
      `}</style>

      <article className="about-page">
        <header className="page-hero reveal">
          <div className="hero-badge" aria-hidden="true">MÓDULO 2 · HENRY</div>
          <h1 className="hero-title">Sobre <span>CineM2</span></h1>
          <p className="hero-subtitle">
            Una plataforma cinematográfica construida desde cero.
            Arquitectura moderna, diseño intencional, código limpio.
          </p>
        </header>

        <section className="section reveal">
          <div className="section-header">
            <span className="section-number">01</span>
            <h2 className="section-title">Objetivo del Proyecto</h2>
          </div>
          <div className="motivation-card">
            <blockquote className="motivation-quote">
              "El cine siempre fue una fuente de inspiración.
              Este proyecto combina mi pasión por la <span>tecnología</span>
              con el arte de <span>contar historias</span>."
            </blockquote>
            <div className="motivation-text">
              <p>
                CineM2 nació como trabajo final del Módulo 2 de la formación Full Stack en Henry.
                El objetivo: demostrar dominio de frontend, backend y base de datos integrados
                en una aplicación real, desplegada y funcional.
              </p>
              <p>
                Cada decisión técnica —desde la elección de Next.js 14 con App Router
                hasta el design system basado en variables CSS— fue tomada
                pensando en <strong>mantenibilidad, escalabilidad y experiencia de usuario</strong>.
              </p>
            </div>
          </div>
        </section>

        <section className="section reveal">
          <div className="section-header">
            <span className="section-number">02</span>
            <h2 className="section-title">Stack Tecnológico</h2>
          </div>
          <div className="tech-grid">
            {TECH_STACK.map((tech, i) => (
              <article key={tech.category} className="tech-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="tech-category">{tech.category}</div>
                <ul className="tech-list">
                  {tech.items.map((item, j) => (
                    <li key={item} className="tech-item" style={{ transitionDelay: `${j * 50}ms` }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal">
          <div className="section-header">
            <span className="section-number">03</span>
            <h2 className="section-title">Características Principales</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((feature, i) => (
              <article key={feature.title} className="feature-card" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal">
          <div className="section-header">
            <span className="section-number">04</span>
            <h2 className="section-title">Cronología de Desarrollo</h2>
          </div>
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <article key={item.date} className="timeline-item" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="timeline-marker" aria-hidden="true" />
                <time className="timeline-date">{item.date}</time>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal">
          <div className="section-header">
            <span className="section-number">05</span>
            <h2 className="section-title">Estructura del Proyecto</h2>
          </div>
          <pre className="structure-block"><code>{`front/
├── app/
│   ├── api/movies/        # API Routes (proxy al backend)
│   ├── about/             # Página "Sobre el proyecto"
│   ├── create/            # Página "Crear/Editar película"
│   ├── history/           # Página "Historia del cine"
│   ├── globals.css        # Design system + estilos globales
│   ├── layout.tsx         # Layout raíz + FilmStrip
│   └── page.tsx           # Home: Hero + Grid películas
├── components/
│   ├── FilmStrip.tsx      # Signature: film strip interactivo
│   ├── MovieCard.tsx      # Tarjeta película (grid/featured)
│   └── MovieList.tsx      # Lista + paginación + toasts
├── lib/
│   └── api.ts             # Cliente API tipado (fetch)
├── next.config.js
├── package.json
└── tsconfig.json`}</code></pre>
        </section>

        <section className="section reveal">
          <div className="section-header">
            <span className="section-number">06</span>
            <h2 className="section-title">Enlaces de Referencia</h2>
          </div>
          <div className="links-grid">
            <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer" className="link-card">
              <span className="link-icon" aria-hidden="true">📚</span>
              <span className="link-text">Next.js Docs</span>
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="link-card">
              <span className="link-icon" aria-hidden="true">⚛️</span>
              <span className="link-text">React Docs</span>
            </a>
            <a href="https://getbootstrap.com/docs/5.3/" target="_blank" rel="noopener noreferrer" className="link-card">
              <span className="link-icon" aria-hidden="true">🎨</span>
              <span className="link-text">Bootstrap 5</span>
            </a>
            <a href="https://www.mongodb.com/docs/" target="_blank" rel="noopener noreferrer" className="link-card">
              <span className="link-icon" aria-hidden="true">🍃</span>
              <span className="link-text">MongoDB Docs</span>
            </a>
            <a href="https://developer.mozilla.org/es/docs/Web/CSS" target="_blank" rel="noopener noreferrer" className="link-card">
              <span className="link-icon" aria-hidden="true">🎯</span>
              <span className="link-text">CSS Variables</span>
            </a>
            <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer" className="link-card">
              <span className="link-icon" aria-hidden="true">♿</span>
              <span className="link-text">ARIA Patterns</span>
            </a>
          </div>
        </section>

        <footer style={{ marginTop: 'var(--space-3xl)', paddingTop: 'var(--space-2xl)', borderTop: '1px solid var(--color-film-edge)', textAlign: 'center' }}>
          <p className="text-silver-muted mono-font text-small">
            Desarrollado con ❤️ por <strong className="text-projector">Ivan Baez</strong> · Henry M2 · 2025
          </p>
        </footer>
      </article>
    </>
  );
}