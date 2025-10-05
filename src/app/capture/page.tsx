'use client';

import { useEffect, useMemo, useState } from 'react';
import { speak } from '@/app/lib/tts';
import { SPECIES, PHENO_PHASES, SpeciesId, Pheno } from '@/app/lib/species';

export default function CapturePage() {
  const [speciesId, setSpeciesId] = useState<SpeciesId>('salvia_officinalis');
  const [phenophase, setPhenophase] = useState<Pheno>('floracion');
  const [photo, setPhoto] = useState<File | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [acc, setAcc] = useState<number | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null); // Para mostrar error de GPS

  // Checar si ya se obtuvo la ubicación
  const ubicacionLista = lat !== null && lon !== null;

  useEffect(() => {
    // Solicitar ubicación al cargar
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setLat(p.coords.latitude);
          setLon(p.coords.longitude);
          setAcc(p.coords.accuracy);
          setGeoError(null); // Si funciona, limpiamos el error
        },
        (err) => {
          setGeoError('No se pudo obtener tu ubicación. Actívala para continuar.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGeoError('Este dispositivo no soporta geolocalización.');
    }
  }, []);

  const previewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : ''), [photo]);

  async function onSubmit() {
    if (!photo) {
      speak('Falta la foto');
      return;
    }
    if (!ubicacionLista) {
      speak('Debes activar la ubicación para continuar');
      return;
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

      {/* Mensaje si la ubicación aún no está lista */}
      {!ubicacionLista && (
        <p className="text-xs text-red-600 mb-2">
          {geoError
            ? geoError + ' Por favor, activa el GPS y recarga la página.'
            : 'Esperando acceso a tu ubicación...'}
        </p>
      )}

      {/* Foto */}
      <label className="block text-sm font-medium">Foto (cámara o galería)</label>
      <input
        className="w-full border rounded p-3"
        type="file"
        accept="image/*"
        capture="environment"
        aria-label="Subir foto"
        disabled={!ubicacionLista}
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
            disabled={!ubicacionLista}
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
            disabled={!ubicacionLista}
            onFocus={() => speak('Seleccionar etapa')}
          >
            {PHENO_PHASES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ubicación */}
      <p className="text-sm text-gray-600">
        Ubicación: {lat?.toFixed(5) ?? '—'}, {lon?.toFixed(5) ?? '—'}{' '}
        {acc ? `(±${Math.round(acc)} m)` : ''}
      </p>

      <button
        disabled={!ubicacionLista || submitting || !photo}
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