"use client"
import { listGroupMembers } from "@/lib/eauth";
import { CrossSVG, SpannerSVG } from "@ensdomains/thorin";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import { useWalletClient } from "wagmi";

const GroupsListItem: FC<{ groupName: string }> = ({ groupName }) => {
    const path = usePathname();
    const { label: appLabel } = useParams();
    const {data: wallet} = useWalletClient();
    const { data: memberCount, status, error } = useQuery({
        queryKey: ["members", appLabel, groupName],
        queryFn: () => listGroupMembers(wallet!, appLabel.toString(), groupName),
        enabled: !!wallet,
        select: (m) => m.length
      });

  return (
    <div className="gli__container">
        <div
            className="gli"
        >
            <div className="gli__name">
                {groupName}
            </div>
            <div className="gli_members">
                {memberCount ?? 0} members
            </div>
            <div className="gli__buttons">
                <a onClick={() => {}}>
                    <CrossSVG className="gli__cross"/>
                </a>
                <Link href={`${path}/${groupName}`}>
                    <SpannerSVG className="gli__edit"/>
                </Link>
            </div>
        </div>
    </div>
  );
}

export default GroupsListItem;
