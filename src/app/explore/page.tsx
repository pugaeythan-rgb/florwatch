'use client';

import { useMemo, useState } from 'react';
import { speak } from '@/app/lib/tts';
import Link from 'next/link';

type Species = {
  id: string;
  name: string;
  emoji: string;
  short: string;
  facts: string[];
};

const SPECIES: Species[] = [
  {
    id: 'salvia_officinalis',
    name: 'Salvia officinalis',
    emoji: '🪻',
    short:
      'Hasta ~70 cm; tallos erectos y pubescentes; hojas ovaladas con nervadura marcada; flores blanco-violáceas en racimos.',
    facts: [
      'Corola hasta 3 cm con labio superior casi recto.',
      'Cáliz más pequeño que la corola con tonos púrpura.',
    ],
  },
  {
    id: 'leucophyllum_frutescens',
    name: 'Leucophyllum frutescens',
    emoji: '🌸',
    short:
      'Arbusto denso (1–2.5 m) con hojas ovaladas aterciopeladas; flores pequeñas en forma de campana/embudo moradas o violetas.',
    facts: [
      'Floración intermitente, a menudo detonada por lluvia.',
      'Cinco lóbulos y dos “labios” en la flor.',
    ],
  },
  {
    id: 'cosmos_bipinnatus',
    name: 'Cosmos bipinnatus',
    emoji: '🌼',
    short:
      '60–120 cm; hojas bipinnadas muy divididas; flores en rosa, púrpura o blanco con centro amarillo anaranjado.',
    facts: [
      'Disco central de flores tubulares pequeñas.',
      'Puede mezclar dos colores en la misma flor.',
    ],
  },
];

export default function ExplorePage() {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return SPECIES;
    return SPECIES.filter(
      (s) =>
        s.name.toLowerCase().includes(t) ||
        s.id.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h2 className="text-xl font-bold">Explora</h2>
      <p className="text-sm text-gray-600">
        Base de datos (MVP) de especies que puedes registrar.
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar especie…"
        className="w-full border rounded-xl p-3 bg-white/90"
        aria-label="Buscar especie"
        onFocus={() => speak('Buscar especie')}
      />

      <div className="space-y-3">
        {list.map((s) => (
          <article
            key={s.id}
            className="rounded-2xl border bg-white p-4 shadow"
            aria-label={s.name}
            onMouseEnter={() => speak(s.name)}
            onFocus={() => speak(s.name)}
          >
            <header className="flex items-center gap-3">
              <span className="text-3xl">{s.emoji}</span>
              <h3 className="text-lg font-semibold">{s.name}</h3>
            </header>
            <p className="text-sm text-gray-700 mt-2">{s.short}</p>
            <details className="mt-2">
              <summary className="cursor-pointer select-none">Ficha técnica</summary>
              <ul className="list-disc pl-6 text-sm mt-1">
                {s.facts.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </details>
          </article>
        ))}
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
