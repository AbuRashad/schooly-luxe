import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from 'react';

const baseCard = 'rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`${baseCard} ${className}`.trim()}>{children}</div>;
}

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      {...props}
    />
  );
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400/40 transition placeholder:text-slate-400 focus:ring ${className}`.trim()}
      {...props}
    />
  );
}
