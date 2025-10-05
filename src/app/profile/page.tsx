'use client';
import { speak } from '@/app/lib/tts';
import Link from 'next/link';
import { useMemo } from 'react';

// MVP: puntos fijos de ejemplo (luego vendrán del backend)
const points = 42;

// Niveles (puedes ajustar umbrales)
const levels = [
  { name: 'Principiante', min: 0 },
  { name: 'Botánico Jr', min: 20 },
  { name: 'Botánico', min: 50 },
  { name: 'Botánico Master', min: 100 },
  { name: 'Botánico Legendario', min: 200 },
];

function levelFrom(points: number) {
  let current = levels[0].name;
  for (const lvl of levels) if (points >= lvl.min) current = lvl.name;
  return current;
}

export default function ProfilePage() {
  const level = useMemo(() => levelFrom(points), []);

  // Huerto: 1 icono por cada 5 puntos (demo)
  const plants = Math.max(1, Math.floor(points / 5));
  const garden = Array.from({ length: plants });

  return (
    <main className="mx-auto max-w-md p-6 space-y-5">
      <h2 className="text-xl font-bold">Mi perfil</h2>

      <div className="rounded-2xl border bg-white/5 p-4 space-y-2">
        <p><span className="font-semibold">Nivel:</span> {level}</p>
        <p><span className="font-semibold">Puntos:</span> {points}</p>
      </div>

      <section>
        <h3 className="font-semibold mb-2">Mi huerto</h3>
        <div className="grid grid-cols-5 gap-3">
          {garden.map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border flex items-center justify-center bg-white"
              aria-label={`planta ${i + 1}`}
              onMouseEnter={() => speak(`Planta ${i + 1}`)}
              onFocus={() => speak(`Planta ${i + 1}`)}
            >
              🌱
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          *Demo: el huerto crece con tus puntos (1 planta cada 5 puntos).
        </p>
      </section>

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
