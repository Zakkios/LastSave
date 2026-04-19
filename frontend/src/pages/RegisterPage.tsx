import { Link } from "react-router";
import RegisterForm from "../features/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090f] text-zinc-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#05070c_0%,#0b1220_44%,#10130e_72%,#050607_100%)]" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="absolute inset-y-0 left-0 w-3/5 bg-[linear-gradient(110deg,rgba(16,185,129,0.18),rgba(34,211,238,0.08)_44%,transparent_74%)]" />
        <div className="absolute -right-36 top-12 h-[42rem] w-[30rem] rotate-12 border border-cyan-200/10 bg-[linear-gradient(160deg,rgba(34,211,238,0.14),rgba(244,63,94,0.06)_52%,transparent)]" />
        <div className="absolute -bottom-44 -left-24 h-[28rem] w-[46rem] -rotate-6 border border-emerald-200/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(250,204,21,0.08)_45%,transparent_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(to_top,rgba(5,7,12,0.96),transparent)]" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <section className="relative max-w-xl py-4">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -left-5 top-20 h-44 w-px bg-gradient-to-b from-transparent via-emerald-200/60 to-transparent"
            />
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
              Inscription
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl">
              Créez votre espace de suivi.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
              Un compte suffit pour garder vos mangas et jeux au même endroit,
              sans interface chargée.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-sm bg-emerald-300" />
                Listes personnelles
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-sm bg-emerald-300" />
                Accès sécurisé
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-sm bg-emerald-300" />
                Thème sombre
              </li>
            </ul>
          </div>
        </section>

        <section
          aria-label="Formulaire d'inscription"
          className="relative w-full max-w-md justify-self-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950/75 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent"
          />
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-zinc-50">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Utilisez une adresse email valide et un mot de passe solide.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-zinc-500">
            Déjà inscrit ?{" "}
            <Link
              to="/"
              className="font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Retour à l'accueil
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
