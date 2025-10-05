import BigButton from '@/components/BigButton';

export default function Home() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-bold">FlorWatch</h1>
      <p className="text-sm text-gray-600">
        Registra floración urbana. Usa los botones o toca para escuchar.
      </p>

      <div className="space-y-3 pt-2">
        <BigButton label="Tomar foto" icon={"📷"} href="/capture" />
        <BigButton label="Mapa" icon={"🗺️"} href="/map" />
        <BigButton label="Mi perfil" icon={"👤"} href="/profile" />
        <BigButton label="Explora" icon={"🌱"} href="/explore" />
      </div>
    </main>
  );
}
