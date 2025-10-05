'use client';
import { speak } from '@/lib/tts';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  icon: ReactNode;
  href: string;
};

export default function BigButton({ label, icon, href }: Props) {
  return (
    <Link
      href={href}
      aria-label={label}
      onMouseEnter={() => speak(label)}
      onFocus={() => speak(label)}
      onClick={() => speak(label)}
      className="flex items-center gap-3 w-full rounded-2xl p-5 bg-white shadow hover:shadow-md border text-lg"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </Link>
  );
}
