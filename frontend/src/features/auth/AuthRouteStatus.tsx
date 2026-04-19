import type { ReactNode } from "react";

interface AuthRouteStatusProps {
  title: string;
  message: string;
  action?: ReactNode;
}

const AuthRouteStatus = ({ title, message, action }: AuthRouteStatusProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090f] px-6 text-zinc-50">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/75 p-6 text-center shadow-2xl shadow-black/40">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Session
        </p>
        <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{message}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </section>
    </main>
  );
};

export default AuthRouteStatus;
