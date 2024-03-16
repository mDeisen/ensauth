"use client"
import { useParams } from "next/navigation";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { label: appLabel } = useParams();
  return (
    <div>
        <section className="section">
            <div className="title">
                {appLabel}
            </div>
        </section>
        <section className="section">
            {children}
        </section>
    </div>
  );
}
