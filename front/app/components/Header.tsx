'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/historiacine', label: 'Historia del Cine' },
    { href: '/sobreproyecto', label: 'Sobre el Proyecto' },
    { href: '/newMovie', label: 'Crear Película' },
  ];

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`} role="banner">
      <div className="header-inner">
        <Link href="/" className="site-logo" aria-label="Cine M2 - Inicio">
          Cine<span>M2</span>
        </Link>

        <nav className="nav" role="navigation" aria-label="Navegación principal">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span aria-hidden="true"></span>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="mobile-menu" role="dialog" aria-label="Menú móvil">
            <nav>
              <ul className="flex flex-col gap-2 p-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`nav-link px-2 py-3 ${pathname === link.href ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={pathname === link.href ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}