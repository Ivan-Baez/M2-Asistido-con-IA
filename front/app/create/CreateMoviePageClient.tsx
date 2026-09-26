import { Suspense } from 'react';
import { Metadata } from 'next';
import CreateMoviePageClient from './CreateMoviePageClient';

export const metadata: Metadata = {
  title: 'Crear Película',
  description: 'Añade una nueva película a tu catálogo cinematográfico.',
};

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 border-4 border-film-edge border-t-projector rounded-full animate-spin mb-md" aria-hidden="true" />
      <p className="text-projector display-font text-heading mb-sm">CARGANDO EDITOR</p>
      <p className="text-silver-dim mono-font text-small">Preparando formulario...</p>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateMoviePageClient />
    </Suspense>
  );
}