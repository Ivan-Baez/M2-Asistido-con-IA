'use client';

import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from './ToastContainer';
import LumiereAssistant from './LumiereAssistant';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow" id="main-content">
        {children}
      </main>
      <Footer />
      <ToastContainer />
      <LumiereAssistant />
    </div>
  );
}