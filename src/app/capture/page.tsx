'use client';

import { useEffect, useMemo, useState } from 'react';
import { speak } from '@/app/lib/tts';

type SpeciesId = 'salvia_officinalis' | 'leucophyllum_frutescens' | 'cosmos_bipinnatus';
type Pheno = 'brotacion' | 'boton' | 'floracion' | 'fructificacion';

const SPECIES: { id: SpeciesId; label: string }[] = [
  { id: 'salvia_officinalis', label: 'Salvia officinalis' },
  { id: 'leucophyllum_frutescens', label: 'Leucophyllum frutescens' },
  { id: 'cosmos_bipinnatus', label: 'Cosmos bipinnatus' },
];

export default function CapturePage() {
  const [speciesId, setSpeciesId] = useState<SpeciesId>('salvia_officinalis');
  const [phenophase, setPhenophase] = useState<Pheno>('floracion');
  const [photo, setPhoto] = useState<File | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [acc, setAcc] = useState<number | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Obtener ubicación al cargar
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setLat(p.coords.latitude);
          setLon(p.coords.longitude);
          setAcc(p.coords.accuracy);
        },
        () => {
          // si el usuario niega permisos, dejamos lat/lon en null
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const previewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : ''), [photo]);

  async function onSubmit() {
    if (!photo) {
      alert('Falta la foto.');
      return;
    }
    if (lat == null || lon == null) {
      const ok = confirm('No tenemos ubicación. ¿Deseas guardar de todos modos?');
      if (!ok) return;
    }
    setSubmitting(true);
    try {
      // MVP sin backend: solo mostramos resumen.
      const msg = `Especie: ${speciesId}\nEtapa: ${phenophase}\nUbicación: ${lat?.toFixed(5) ?? '-'}, ${lon?.toFixed(5) ?? '-'}\nPrecisión: ${acc ? Math.round(acc) + ' m' : '-'}`;
      console.log('[Sighting demo]', { speciesId, phenophase, lat, lon, acc, photo });
      speak('Avistamiento guardado en modo demo');
      alert('✅ Avistamiento (demo)\n\n' + msg);

      // Enlazar a inicio
      window.location.href = '/';
    } catch (e) {
      alert('Error al guardar');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h2 className="text-xl font-bold">Nuevo avistamiento</h2>

      {/* Foto */}
      <label className="block text-sm font-medium">Foto (cámara o galería)</label>
      <input
        className="w-full border rounded p-3"
        type="file"
        accept="image/*"
        capture="environment"
        aria-label="Subir foto"
        onFocus={() => speak('Subir foto')}
        onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
      />
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Vista previa"
          className="rounded-xl border w-full max-h-72 object-cover"
        />
      )}

      {/* Selecciones */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Especie</label>
          <select
            className="w-full border rounded p-2"
            value={speciesId}
            onChange={(e) => setSpeciesId(e.target.value as SpeciesId)}
            onFocus={() => speak('Seleccionar especie')}
          >
            {SPECIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Etapa</label>
          <select
            className="w-full border rounded p-2"
            value={phenophase}
            onChange={(e) => setPhenophase(e.target.value as Pheno)}
            onFocus={() => speak('Seleccionar etapa')}
          >
            <option value="brotacion">Brotación</option>
            <option value="boton">Botón floral</option>
            <option value="floracion">Floración</option>
            <option value="fructificacion">Fructificación</option>
          </select>
        </div>
      </div>

      {/* Ubicación */}
      <p className="text-sm text-gray-600">
        Ubicación: {lat?.toFixed(5) ?? '—'}, {lon?.toFixed(5) ?? '—'}{' '}
        {acc ? `(±${Math.round(acc)} m)` : ''}
      </p>

      <button
        disabled={submitting}
        onClick={onSubmit}
        className="w-full p-4 rounded-2xl bg-green-600 text-white font-semibold disabled:opacity-50"
        onFocus={() => speak('Confirmar avistamiento')}
        onMouseEnter={() => speak('Confirmar avistamiento')}
      >
        {submitting ? 'Guardando…' : 'Confirmar (demo)'}
      </button>

      <p className="text-xs text-gray-500">
        *Modo demo: guarda en memoria y muestra resumen. En el siguiente paso conectaremos con
        base de datos para enviar la foto y los datos.
      </p>
    </main>
  );
}
