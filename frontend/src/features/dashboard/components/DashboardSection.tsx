import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

const DashboardSection = ({ title, icon, children }: DashboardSectionProps) => (
  <section className="space-y-4">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-50">
      {icon}
      {title}
    </h2>
    {children}
  </section>
);

export default DashboardSection;
