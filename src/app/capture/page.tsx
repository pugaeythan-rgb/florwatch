'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { speak } from '@/lib/tts';

// Leaflet / React-Leaflet
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

type Sighting = {
  id: number;
  speciesId: 'salvia_officinalis' | 'leucophyllum_frutescens' | 'cosmos_bipinnatus' | string;
  phenophase: 'brotacion' | 'boton' | 'floracion' | 'fructificacion' | string;
  lat: number | null;
  lon: number | null;
  accuracyM: number | null;
  datetimeISO: string;
  photoDataURL?: string;
};

// Colores por especie (puedes ajustar a tu gusto)
function speciesColor(id: string) {
  const m: Record<string, string> = {
    salvia_officinalis: '#4caf50',        // salvia
    leucophyllum_frutescens: '#2196f3',   // cenizo
    cosmos_bipinnatus: '#ff9800',         // cosmos
  };
  return m[id] ?? '#607d8b';
}

export default function MapPage() {
  // Cargar avistamientos que guardamos en /capture
  const [sightings, setSightings] = useState<Sighting[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('sightings_v1') || '[]';
      const parsed = JSON.parse(raw) as Sighting[];
      setSightings(parsed.filter(s => typeof s.lat === 'number' && typeof s.lon === 'number'));
    } catch {
      setSightings([]);
    }
  }, []);

  // Centro CDMX
  const center: [number, number] = [19.4326, -99.1332];
  const zoom = 11;

  const hasData = sightings.length > 0;

  const markers = useMemo(() => {
    return sightings.map((s) => {
      const color = speciesColor(s.speciesId);
      const pos: [number, number] = [Number(s.lat), Number(s.lon)];
      return { s, color, pos };
    });
  }, [sightings]);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Mapa</h2>
      <p className="text-sm text-gray-600">
        Mapa interactivo de CDMX con tus avistamientos locales.
      </p>

      <div className="rounded-2xl border overflow-hidden h-[28rem]">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            // OpenStreetMap
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {markers.map(({ s, color, pos }) => (
            <CircleMarker
              key={s.id}
              center={pos}
              radius={10}
              weight={3}
              color={color}
              fillColor={color}
              fillOpacity={0.8}
            >
              <Popup>
                <div style={{ maxWidth: 220 }}>
                  <h4 style={{ margin: '0 0 .25rem 0' }}>
                    {s.speciesId.replaceAll('_', ' ')}
                  </h4>
                  <p style={{ margin: 0 }}>
                    <strong>Etapa:</strong> {s.phenophase}<br />
                    <strong>Fecha:</strong> {new Date(s.datetimeISO).toLocaleString()}<br />
                    {s.accuracyM ? <><strong>Precisión:</strong> ±{Math.round(s.accuracyM)} m<br/></> : null}
                    <strong>Ubicación:</strong> {s.lat?.toFixed(5)}, {s.lon?.toFixed(5)}
                  </p>
                  {s.photoDataURL && (
                    <img
                      src={s.photoDataURL}
                      alt="foto"
                      style={{ marginTop: 8, width: '100%', borderRadius: 12, border: '1px solid #ddd' }}
                    />
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {!hasData && (
        <div className="text-sm text-gray-500">
          Aún no hay avistamientos guardados en este dispositivo. Ve a{' '}
          <Link
            href="/capture"
            className="underline"
            onMouseEnter={() => speak('Tomar foto')}
            onFocus={() => speak('Tomar foto')}
            onClick={() => speak('Tomar foto')}
          >
            Tomar foto
          </Link>{' '}
          para registrar el primero.
        </div>
      )}

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
