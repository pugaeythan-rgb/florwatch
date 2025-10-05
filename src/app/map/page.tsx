'use client';
import { speak } from '@/app/lib/tts';
import Link from 'next/link';

export default function MapPage() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h2 className="text-xl font-bold">Mapa</h2>
      <p className="text-sm text-gray-600">
        Aquí verás los avistamientos filtrados por especie y etapa (MVP en construcción).
      </p>

      <div className="rounded-2xl border h-80 flex items-center justify-center bg-white/5">
        <span className="text-gray-500">[Mapa — pronto]</span>
      </div>

      <Link
        href="/"
        className="block text-center p-3 rounded-xl bg-white border shadow"
        onMouseEnter={() => speak('Volver al inicio')}
        onFocus={() => speak('Volver al inicio')}
        onClick={() => speak('Volver al inicio')}
      >
        ← Volver
      </Link>
    </main>
  );
}
