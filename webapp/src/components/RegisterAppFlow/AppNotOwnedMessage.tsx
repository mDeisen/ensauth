"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const AppNotOwnedMessage: FC = () => {
    const path = usePathname();

  return (
    <div className="block">
        This app is registered but you're not the owner. You can still <Link href={`${path}/profile`} className="link"> view your group memberships here</Link>.
    </div>
  );
}

export default AppNotOwnedMessage;
