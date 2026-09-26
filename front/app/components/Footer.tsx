import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <p>&copy; {new Date().getFullYear()} Cine M2 - Proyecto Módulo 2</p>
        <p className="mt-2 text-xs">
          Construido con Next.js 14 + Express + MongoDB
        </p>
      </div>
    </footer>
  );
}