import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AgenticFactory3D = lazy(() => import('./agentic-factory-3d'));

export default function AuthFactoryPanel() {
  const [desktopLayout, setDesktopLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateLayout = () => setDesktopLayout(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  return (
    <aside className="hidden lg:block lg:w-[55%] xl:w-1/2 relative h-screen h-dvh overflow-hidden border-r border-white/[0.06] bg-black">
      {desktopLayout && (
        <Suspense fallback={<div className="absolute inset-0 bg-black" aria-label="Loading factory animation" />}>
          <AgenticFactory3D height="100%" embed />
        </Suspense>
      )}
      <Link
        to="/"
        className="absolute left-8 top-8 z-30 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Back to home</span>
      </Link>
    </aside>
  );
}
