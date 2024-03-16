"use client"
import AppNotOwnedMessage from "@/components/RegisterAppFlow/AppNotOwnedMessage";
import DomainNotOwnedMessage from "@/components/RegisterAppFlow/DomainNotOwnedMessage";
import RegisterEnsPrompt from "@/components/RegisterAppFlow/RegisterEnsPrompt";
import { isAppOwnedByUser, isAppRegistered } from "@/lib/eauth";
import { getOwner } from "@/lib/ens";
import { Skeleton } from "@ensdomains/thorin";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useWalletClient } from "wagmi";

export default function Dashboard() {
    const path = usePathname();
    const { label: appLabel } = useParams();
    const { data: wallet } = useWalletClient();

    const { data: domainIsRegistered } = useQuery({
      queryKey: ["getEnsOwner", appLabel],
      queryFn: () => getOwner(wallet!, appLabel.toString()),
      enabled: !!wallet,
      select: (data) => data !== null
    });

    const { data: appIsRegistered } = useQuery({
      queryKey: ["appRegistered", appLabel],
      queryFn: () => isAppRegistered(wallet!, appLabel.toString()),
      enabled: domainIsRegistered === true
    });

    const { data: appIsOwnedByUser, isSuccess } = useQuery({
      queryKey: ["appOwned", appLabel],
      queryFn: () => isAppOwnedByUser(wallet!, appLabel.toString()),
      enabled: domainIsRegistered === true
    });

    if (domainIsRegistered === false) {
      return <RegisterEnsPrompt/>
    }

    if (appIsOwnedByUser === false && appIsRegistered === false) {
      return <DomainNotOwnedMessage/>
    }

    if (appIsOwnedByUser === false && appIsRegistered === true) {
      return <AppNotOwnedMessage/>
    }

    if (appIsRegistered === false) {
      return <RegisterEnsPrompt/>
    }

    return <Skeleton loading={!isSuccess}><div className="buttons">
      <Link className="button" href={`${path}/profile`}>
        Your profile
      </Link>
      <Link className="button" href={`${path}/administration`}>
        User administration
      </Link>
    </div></Skeleton>;
}
