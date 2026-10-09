'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Setiap kali rute halaman berganti, jalankan transisi bar atas halus
    setVisible(true);
    setProgress(35);

    const timer1 = setTimeout(() => {
      setProgress(75);
    }, 70);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 160);

    const timer3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 360);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-100 h-0.75 pointer-events-none bg-transparent overflow-hidden">
      <div
        className="h-full bg-linear-to-r from-blue-500 via-indigo-600 to-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.85)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
