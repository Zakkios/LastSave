import type { ReactNode } from "react";

interface AuthPageLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  formLabel: string;
  formTitle: string;
  formDescription: string;
  children: ReactNode;
  footer: ReactNode;
}

const AuthPageLayout = ({
  eyebrow,
  title,
  description,
  highlights,
  formLabel,
  formTitle,
  formDescription,
  children,
  footer,
}: AuthPageLayoutProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090f] text-zinc-50">
      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <section className="relative max-w-xl py-4">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -left-5 top-20 h-44 w-px bg-linear-to-b from-transparent via-emerald-200/60 to-transparent"
            />
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
              {description}
            </p>
            <ul className="mt-8 space-y-3 text-sm text-zinc-300">
              {highlights.map((highlight) => (
                <li className="flex items-center gap-3" key={highlight}>
                  <span className="h-2 w-2 rounded-sm bg-emerald-300" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          aria-label={formLabel}
          className="relative w-full max-w-md justify-self-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950/75 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-emerald-200/70 to-transparent"
          />
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-zinc-50">{formTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400">{formDescription}</p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-zinc-500">{footer}</p>
        </section>
      </div>
    </main>
  );
};

export default AuthPageLayout;
