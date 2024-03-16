"use client"
import RegisterAppFlow from "@/components/RegisterAppFlow";
import AppNotOwnedMessage from "@/components/RegisterAppFlow/AppNotOwnedMessage";
import DomainNotOwnedMessage from "@/components/RegisterAppFlow/DomainNotOwnedMessage";
import { isAppOwnedByUser, isAppRegistered, listGroups } from "@/lib/eauth";
import { getOwner } from "@/lib/ens";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";
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

    const { data: appIsOwnedByUser } = useQuery({
      queryKey: ["appOwned", appLabel],
      queryFn: () => isAppOwnedByUser(wallet!, appLabel.toString()),
      enabled: domainIsRegistered === true
    });

    const { data: groupsNumber } = useQuery({
      queryKey: ["groups", "appLabel"],
      queryFn: () => listGroups(wallet!, appLabel.toString()),
      enabled: domainIsRegistered === true,
      select: (groups) => groups.length
    });

    let step = 1;
    let warning: ReactNode = undefined;

    if (domainIsRegistered === true) {
      step = 2;
    }

    if (appIsRegistered === true) {
      step = 3;
    }

    if (groupsNumber && groupsNumber > 0) {
      step = 4
    }

    if (appIsOwnedByUser === false && appIsRegistered === false) {
      warning = <DomainNotOwnedMessage/>
    }

    if (appIsOwnedByUser === false && appIsRegistered === true) {
      warning = <AppNotOwnedMessage/>
    }

    return <div>
      {warning}
      <RegisterAppFlow step={step}/>
    </div>;
}
