"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const AppNotOwnedMessage: FC = () => {
    const path = usePathname();

  return (
    <>
        <div>
            This app is registered but you're not the owner. You may view your group memberships here and add them to your profile.
        </div>
        <div>
        <Link className="button" href={`${path}/profile`}>
            Your profile
        </Link>
        </div>
    </>
  );
}

export default AppNotOwnedMessage;
