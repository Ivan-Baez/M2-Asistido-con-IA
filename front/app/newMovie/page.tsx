'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/components/ToastContainer';

interface FormData {
  title: string;
  year: string;
  director: string;
  duration: string;
  genres: string[];
  rate: string;
  poster: string;
}

const initialFormData: FormData = {
  title: '',
  year: '',
  director: '',
  duration: '',
  genres: [],
  rate: '',
  poster: '',
};

const genreOptions = [
  'Acción',
  'Terror',
  'Aventura',
  'Drama',
  'Comedia',
  'Ciencia Ficción',
  'Suspenso',
  'Romance',
  'Animación',
  'Documental',
];

export default function NewMoviePage() {
  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [isLoading, setIsLoading] =
    useState(false);

  const { showToast } = useToast();

  /* =========================================================
     CAMBIOS DEL FORMULARIO
  ========================================================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,

        genres: checked
          ? [...prev.genres, value]
          : prev.genres.filter(
              (g) => g !== value
            ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* =========================================================
     VALIDACIÓN
  ========================================================= */

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'El título es obligatorio';
    }

    if (!formData.year) {
      return 'El año es obligatorio';
    }

    if (
      parseInt(formData.year) < 1888 ||
      parseInt(formData.year) >
        new Date().getFullYear() + 2
    ) {
      return `El año debe estar entre 1888 y ${
        new Date().getFullYear() + 2
      }`;
    }

    if (!formData.director.trim()) {
      return 'El director es obligatorio';
    }

    if (!formData.duration.trim()) {
      return 'La duración es obligatoria';
    }

    if (!formData.rate) {
      return 'El puntaje es obligatorio';
    }

    if (
      parseFloat(formData.rate) < 0 ||
      parseFloat(formData.rate) > 10
    ) {
      return 'El puntaje debe estar entre 0 y 10';
    }

    if (!formData.poster.trim()) {
      return 'La URL del póster es obligatoria';
    }

    try {
      new URL(formData.poster);
    } catch {
      return 'La URL del póster no es válida';
    }

    if (!formData.genres.length) {
      return 'Selecciona al menos un género';
    }

    return null;
  };

  /* =========================================================
     ENVIAR FORMULARIO
  ========================================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      showToast('error', error);
      return;
    }

    setIsLoading(true);

    try {
      const movieData = {
        title: formData.title.trim(),
        year: parseInt(formData.year),
        director: formData.director.trim(),
        duration: formData.duration.trim(),
        genres: formData.genres,
        rate: parseFloat(formData.rate),
        poster: formData.poster.trim(),
      };

      const response = await fetch(
        'http://localhost:3001/movies',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movieData),
        }
      );

      if (!response.ok) {
        const errorData =
          await response
            .json()
            .catch(() => ({}));

        throw new Error(
          errorData.message ||
            'Error al crear la película'
        );
      }

      showToast(
        'success',
        'Película agregada correctamente'
      );

      setFormData(initialFormData);
    } catch (error) {
      console.error(
        'Error creating movie:',
        error
      );

      showToast(
        'error',
        error instanceof Error
          ? error.message
          : 'No se pudo crear la película'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     LIMPIAR FORMULARIO
  ========================================================= */

  const handleReset = () => {
    if (
      window.confirm(
        '¿Descartar cambios? Se perderán los datos del formulario.'
      )
    ) {
      setFormData(initialFormData);
    }
  };

  return (
    <>
      <style jsx>{`

        /* =====================================================
           PÁGINA PRINCIPAL
        ===================================================== */

        .new-movie-page {
          width: 100%;
          min-height: 100vh;

          overflow-x: hidden;

          background: var(--color-void);
          color: var(--color-silver);
        }

        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          position: relative;

          width: 100%;
          min-height: 390px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 70px 24px 60px;

          text-align: center;

          border-bottom:
            1px solid var(--color-film-edge);

          background: var(--color-void);
        }

        .hero-content {
          width: 100%;
          max-width: 820px;
        }

        .hero-badge {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 24px;

          padding: 7px 16px;

          border:
            1px solid var(--color-projector);

          border-radius: 999px;

          background:
            var(--color-velvet);

          font-family:
            var(--font-display);

          font-size: 10px;

          font-weight: 600;

          letter-spacing: 0.16em;

          color:
            var(--color-projector);

          text-transform: uppercase;
        }

        .hero-title {
          margin: 0 0 18px;

          font-family:
            var(--font-display);

          font-size:
            clamp(
              3.2rem,
              8vw,
              6rem
            );

          line-height: 0.95;

          font-weight: 700;

          letter-spacing: -0.03em;

          color:
            var(--color-silver);
        }

        .hero-title span {
          color:
            var(--color-projector);
        }

        .hero-subtitle {
          max-width: 650px;

          margin: 0 auto;

          font-family:
            var(--font-body);

          font-size:
            clamp(
              0.95rem,
              2vw,
              1.1rem
            );

          line-height: 1.7;

          font-weight: 300;

          color:
            var(--color-silver-dim);
        }

        /* =====================================================
           CONTENEDOR
        ===================================================== */

        .content {
          width:
            min(
              950px,
              calc(100% - 48px)
            );

          margin: 0 auto;

          padding:
            75px 0 100px;
        }

        /* =====================================================
           IDENTIFICACIÓN DEL FORMULARIO
        ===================================================== */

        .form-header {
          margin-bottom: 42px;

          padding-bottom: 28px;

          border-bottom:
            1px solid var(--color-film-edge);
        }

        .form-kicker {
          display: inline-flex;

          align-items: center;

          margin-bottom: 18px;

          padding: 7px 14px;

          border:
            1px solid var(--color-projector);

          border-radius: 999px;

          background:
            var(--color-velvet);

          font-family:
            var(--font-mono);

          font-size: 0.65rem;

          letter-spacing: 0.14em;

          color:
            var(--color-projector);

          text-transform: uppercase;
        }

        .form-number {
          margin-bottom: 8px;

          font-family:
            var(--font-display);

          font-size: 4.5rem;

          line-height: 0.9;

          font-weight: 700;

          color:
            var(--color-projector);
        }

        .form-title {
          margin: 0 0 12px;

          font-family:
            var(--font-display);

          font-size:
            clamp(
              2rem,
              5vw,
              3rem
            );

          line-height: 1.1;

          color:
            var(--color-silver);
        }

        .form-description {
          max-width: 650px;

          margin: 0;

          font-family:
            var(--font-body);

          font-size: 0.95rem;

          line-height: 1.7;

          color:
            var(--color-silver-dim);
        }

        /* =====================================================
           FORMULARIO
        ===================================================== */

        .movie-form {
          display: flex;

          flex-direction: column;

          gap: 30px;
        }

        /* =====================================================
           SECCIONES DEL FORMULARIO
        ===================================================== */

        .form-section {
          position: relative;

          padding: 34px;

          border:
            1px solid var(--color-film-edge);

          border-left:
            4px solid var(--color-projector);

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              rgba(62, 51, 51, 0.04),
              transparent 45%
            ),
            var(--color-velvet);

          box-shadow:
            0 12px 35px
            rgba(46, 38, 38, 0.25);

          overflow: hidden;
        }

        .form-section::before {
          content: '';

          position: absolute;

          top: 0;
          left: 0;

          width: 100%;
          height: 1px;

          background:
            var(--color-projector);

          opacity: 0.45;
        }

        .form-section-title {
          display: flex;

          align-items: center;

          gap: 12px;

          margin: 0 0 28px;

          padding-bottom: 16px;

          border-bottom:
            1px solid
            var(--color-film-edge);

          font-family:
            var(--font-display);

          font-size: 1.35rem;

          color:
            var(--color-silver);

          letter-spacing: 0.02em;
        }

        .form-section-title::before {
          content: '●';

          display: inline-flex;

          align-items: center;
          justify-content: center;

          width: 28px;
          height: 28px;

          border:
            1px solid
            var(--color-projector);

          border-radius: 50%;

          color:
            var(--color-projector);

          font-size: 8px;

          flex-shrink: 0;
        }

        /* =====================================================
           GRUPOS
        ===================================================== */

        .form-group {
          display: flex;

          flex-direction: column;

          gap: 8px;

          margin-bottom: 22px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-row {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 20px;
        }

        .form-label {
          display: flex;

          align-items: center;

          gap: 4px;

          font-family:
            var(--font-display);

          font-size: 0.76rem;

          font-weight: 600;

          letter-spacing: 0.07em;

          color:
            var(--color-silver);

          text-transform: uppercase;
        }

        .required {
          color:
            var(--color-projector);
        }

        /* =====================================================
           INPUTS
        ===================================================== */

        .form-input {
          width: 100%;

          min-height: 48px;

          padding: 12px 14px;

          box-sizing: border-box;

          border:
            1px solid
            var(--color-film-edge);

          border-radius: 7px;

          outline: none;

          background: #4e4040;

          font-family:
            var(--font-body);

          font-size: 0.9rem;

          color:
            var(--color-silver);

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .form-input::placeholder {
          color:
            var(--color-silver-muted);
        }

        .form-input:hover {
          border-color:
            var(--color-projector);
        }

        .form-input:focus {
          border-color:
            var(--color-projector);

          background: #483e3e;

          box-shadow:
            0 0 0 3px
            rgba(212, 175, 55, 0.10);
        }

        /* =====================================================
           GÉNEROS
        ===================================================== */

        .checkbox-group {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 10px;

          border: none;

          padding: 0;

          margin: 0;
        }

        .checkbox-item {
          display: flex;

          align-items: center;

          gap: 9px;

          padding: 11px 12px;

          border:
            1px solid
            var(--color-film-edge);

          border-radius: 7px;

          background:
            var(--color-void);

          cursor: pointer;

          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .checkbox-item:hover {
          border-color:
            var(--color-projector);

          background:
            rgba(
              255,
              255,
              255,
              0.02
            );
        }

        .checkbox-item input {
          width: 16px;
          height: 16px;

          accent-color:
            var(--color-projector);

          cursor: pointer;
        }

        .checkbox-item label {
          cursor: pointer;

          font-family:
            var(--font-body);

          font-size: 0.82rem;

          color:
            var(--color-silver-dim);
        }

        .helper-text {
          margin: 8px 0 0;

          font-family:
            var(--font-mono);

          font-size: 0.68rem;

          line-height: 1.5;

          color:
            var(--color-silver-muted);
        }

        /* =====================================================
           PÓSTER Y VISTA PREVIA
        ===================================================== */

        .preview-section {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            230px;

          gap: 30px;

          align-items: start;
        }

        .preview-image-wrapper {
          width: 230px;

          aspect-ratio: 2 / 3;

          overflow: hidden;

          border:
            1px solid
            var(--color-film-edge);

          border-radius: 10px;

          background:
            var(--color-void);
        }

        .preview-image {
          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;
        }

        .preview-placeholder {
          width: 100%;
          height: 100%;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          box-sizing: border-box;

          text-align: center;

          font-family:
            var(--font-mono);

          font-size: 0.7rem;

          line-height: 1.5;

          color:
            var(--color-silver-muted);
        }

        /* =====================================================
           ACCIONES
        ===================================================== */

        .actions {
          display: flex;

          align-items: center;

          flex-wrap: wrap;

          gap: 12px;

          padding-top: 5px;
        }

        .button {
          min-height: 44px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          padding: 10px 18px;

          border:
            1px solid
            var(--color-film-edge);

          border-radius: 7px;

          background:
            var(--color-velvet);

          font-family:
            var(--font-display);

          font-size: 0.74rem;

          font-weight: 600;

          letter-spacing: 0.04em;

          text-decoration: none;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }

        .button:hover:not(:disabled) {
          transform:
            translateY(-2px);
        }

        .button:disabled {
          opacity: 0.55;

          cursor: not-allowed;
        }

        .button-primary {
          border-color:
            var(--color-projector);

          background:
            var(--color-projector);

          color:
            var(--color-void);
        }

        .button-primary:hover:not(:disabled) {
          background:
            var(--color-silver);

          border-color:
            var(--color-silver);
        }

        .button-secondary {
          color:
            var(--color-silver);
        }

        .button-secondary:hover:not(:disabled) {
          border-color:
            var(--color-projector);

          color:
            var(--color-projector);
        }

        .button-ghost {
          color:
            var(--color-silver-dim);
        }

        .button-ghost:hover {
          border-color:
            var(--color-projector);

          color:
            var(--color-projector);
        }

        /* =====================================================
           LOADING
        ===================================================== */

        .spinner {
          animation:
            spin 0.9s linear infinite;
        }

        @keyframes spin {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }

        /* =====================================================
           FOOTER
        ===================================================== */

        .page-footer {
          margin-top: 65px;

          padding-top: 35px;

          border-top:
            1px solid
            var(--color-film-edge);

          text-align: center;
        }

        .footer-label {
          margin: 0 0 8px;

          font-family:
            var(--font-display);

          font-size: 0.68rem;

          font-weight: 600;

          letter-spacing: 0.18em;

          color:
            var(--color-silver-dim);
        }

        .footer-text {
          margin: 0;

          font-family:
            var(--font-body);

          font-size: 0.82rem;

          color:
            var(--color-silver-muted);
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 768px) {

          .hero {
            min-height: 340px;

            padding:
              60px 20px 55px;
          }

          .hero-title {
            font-size:
              clamp(
                3rem,
                15vw,
                4.5rem
              );
          }

          .hero-subtitle {
            font-size: 0.88rem;
          }

          .content {
            width:
              calc(100% - 32px);

            padding:
              60px 0 75px;
          }

          .form-number {
            font-size: 3.5rem;
          }

          .form-section {
            padding: 24px 18px;
          }

          .form-row {
            grid-template-columns: 1fr;

            gap: 0;
          }

          .checkbox-group {
            grid-template-columns: 1fr;
          }

          .preview-section {
            grid-template-columns: 1fr;
          }

          .preview-image-wrapper {
            width: 180px;
          }

          .actions {
            flex-direction: column;

            align-items: stretch;
          }

          .button {
            width: 100%;
          }

        }

        @media (max-width: 480px) {

          .hero {
            min-height: 300px;
          }

          .hero-title {
            font-size: 2.8rem;
          }

          .form-title {
            font-size: 1.8rem;
          }

          .preview-image-wrapper {
            width: 160px;
          }

        }

        /* =====================================================
           ACCESIBILIDAD
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .form-input,
          .checkbox-item,
          .button {
            transition: none;
          }

          .spinner {
            animation: none;
          }

        }

      `}</style>

      <div className="new-movie-page">

        {/* =====================================================
            HERO PRINCIPAL
        ===================================================== */}

        <section
          className="hero"
          aria-labelledby="page-title"
        >

          <div className="hero-content">

            <div className="hero-badge">
              CINE M2 · CATÁLOGO
            </div>

            <h1
              id="page-title"
              className="hero-title"
            >
              Nueva <span>Película</span>
            </h1>

            <p className="hero-subtitle">
              Completa el formulario para agregar
              una nueva película a tu catálogo.
            </p>

          </div>

        </section>

        {/* =====================================================
            CONTENIDO
        ===================================================== */}

        <main className="content">

          {/* ===================================================
              IDENTIFICACIÓN DEL FORMULARIO
          =================================================== */}

          <div className="form-header">

            <div className="form-kicker">
              FORMULARIO DE REGISTRO
            </div>

            <div className="form-number">
              01
            </div>

            <h2
              id="form-heading"
              className="form-title"
            >
              Información de la Película
            </h2>

            <p className="form-description">
              Completa los siguientes campos para
              incorporar una nueva película al
              catálogo. Los campos marcados con *
              son obligatorios.
            </p>

          </div>

          {/* ===================================================
              FORMULARIO
          =================================================== */}

          <form
            onSubmit={handleSubmit}
            className="movie-form"
            noValidate
          >

            {/* =================================================
                DATOS PRINCIPALES
            ================================================= */}

            <section className="form-section">

              <h3 className="form-section-title">
                Datos principales
              </h3>

              {/* TÍTULO */}

              <div className="form-group">

                <label
                  htmlFor="title"
                  className="form-label"
                >
                  Título
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="title"
                  id="title"
                  className="form-input"
                  placeholder="Star Wars: Episodio IV - Una Nueva Esperanza"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />

              </div>

              {/* AÑO + PUNTAJE */}

              <div className="form-row">

                <div className="form-group">

                  <label
                    htmlFor="year"
                    className="form-label"
                  >
                    Año
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    name="year"
                    id="year"
                    className="form-input"
                    placeholder="1977"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    min="1888"
                    max={
                      new Date().getFullYear() + 2
                    }
                  />

                </div>

                <div className="form-group">

                  <label
                    htmlFor="rate"
                    className="form-label"
                  >
                    Puntaje (0-10)
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    type="number"
                    name="rate"
                    id="rate"
                    className="form-input"
                    placeholder="8.7"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rate}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* DIRECTOR */}

              <div className="form-group">

                <label
                  htmlFor="director"
                  className="form-label"
                >
                  Director
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="director"
                  id="director"
                  className="form-input"
                  placeholder="George Lucas"
                  value={formData.director}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />

              </div>

              {/* DURACIÓN */}

              <div className="form-group">

                <label
                  htmlFor="duration"
                  className="form-label"
                >
                  Duración
                  <span className="required">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="duration"
                  id="duration"
                  className="form-input"
                  placeholder="2h 2min / 122 min"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />

              </div>

            </section>

            {/* =================================================
                GÉNEROS
            ================================================= */}

            <section className="form-section">

              <h3 className="form-section-title">
                Géneros
              </h3>

              <div className="form-group">

                <label className="form-label">
                  Selecciona los géneros
                  <span className="required">
                    *
                  </span>
                </label>

                <fieldset
                  className="checkbox-group"
                  role="group"
                  aria-label="Seleccionar géneros"
                >

                  {genreOptions.map(
                    (genre) => (

                      <div
                        key={genre}
                        className="checkbox-item"
                      >

                        <input
                          type="checkbox"
                          name="genres"
                          id={`genre-${genre}`}
                          value={genre}
                          checked={formData.genres.includes(
                            genre
                          )}
                          onChange={handleChange}
                        />

                        <label
                          htmlFor={`genre-${genre}`}
                        >
                          {genre}
                        </label>

                      </div>

                    )
                  )}

                </fieldset>

                <p className="helper-text">
                  Selecciona al menos un género
                </p>

              </div>

            </section>

            {/* =================================================
                MATERIAL VISUAL
            ================================================= */}

            <section className="form-section">

              <h3 className="form-section-title">
                Material visual
              </h3>

              <div className="preview-section">

                <div>

                  <div className="form-group">

                    <label
                      htmlFor="poster"
                      className="form-label"
                    >
                      URL del Póster
                      <span className="required">
                        *
                      </span>
                    </label>

                    <input
                      type="url"
                      name="poster"
                      id="poster"
                      className="form-input"
                      placeholder="https://ejemplo.com/poster.jpg"
                      value={formData.poster}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                    />

                    <p className="helper-text">
                      Debe ser una URL válida
                      de imagen (jpg, png, webp).
                    </p>

                  </div>

                  <div
                    style={{
                      marginTop: '28px',
                    }}
                  >

                    <p className="form-label">
                      Vista previa
                    </p>

                    <p className="helper-text">
                      El póster aparecerá en el
                      área de vista previa cuando
                      introduzcas una URL válida.
                    </p>

                  </div>

                </div>

                <div className="preview-image-wrapper">

                  {formData.poster ? (

                    <img
                      src={formData.poster}
                      alt="Vista previa del póster"
                      className="preview-image"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          'none';
                      }}
                    />

                  ) : (

                    <div className="preview-placeholder">

                      SIN
                      <br />
                      VISTA PREVIA

                    </div>

                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                ACCIONES
            ================================================= */}

            <div className="actions">

              {/* GUARDAR */}

              <button
                type="submit"
                className="button button-primary"
                disabled={isLoading}
              >

                {isLoading ? (

                  <>
                    <svg
                      className="spinner"
                      width="17"
                      height="17"
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
                        strokeOpacity="0.25"
                      />

                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        strokeLinecap="round"
                      />

                    </svg>

                    Guardando...
                  </>

                ) : (

                  <>
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <line
                        x1="12"
                        y1="5"
                        x2="12"
                        y2="19"
                      />

                      <line
                        x1="5"
                        y1="12"
                        x2="19"
                        y2="12"
                      />

                    </svg>

                    Guardar Película
                  </>

                )}

              </button>

              {/* LIMPIAR */}

              <button
                type="button"
                className="button button-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                  />

                  <path
                    d="M21 12v5h-5"
                  />

                </svg>

                Limpiar

              </button>

              {/* VOLVER */}

              <Link
                href="/"
                className="button button-ghost"
              >

                <svg
                  width="17"
                  height="17"
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

                  <polyline
                    points="12 19 5 12 12 5"
                  />

                </svg>

                Volver al catálogo

              </Link>

            </div>

          </form>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="page-footer">

            <p className="footer-label">
              CINE M2 · NUEVA PELÍCULA
            </p>

            <p className="footer-text">
              Agrega una nueva historia a tu catálogo.
            </p>

          </footer>

        </main>

      </div>
    </>
  );
}