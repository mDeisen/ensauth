"use client"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Dashboard() {
    const path = usePathname();
    const { label: appLabel } = useParams();

  return (
    <>
      <section className="section">
        <div className="title">
            {appLabel}
        </div>
        <div className="buttons">
          <Link className="button" href={`${path}/profile`}>
            Your profile
          </Link>
          <Link className="button" href={`${path}/administration`}>
            User administration
          </Link>
        </div>
      </section>
    </>
  );
}
