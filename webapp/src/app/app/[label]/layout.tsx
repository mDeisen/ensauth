"use client"
import { useParams } from "next/navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { label: appLabel } = useParams();
  return (
    <div className="container is-max-desktop">
        <section className="section">
            <div className="title is-2">
                {appLabel}
            </div>
        </section>
        <section className="section">
            {children}
        </section>
    </div>
  );
}
