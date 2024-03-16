"use client"
import { getProfile } from "@/lib/ens";
import { Avatar, CrossSVG, Skeleton } from "@ensdomains/thorin";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FC } from "react";
import { useWalletClient } from "wagmi";

const MembersListItem: FC<{ addr: string }> = ({ addr }) => {
    const { data: wallet } = useWalletClient();
    const { data: profile, isSuccess } = useQuery({
        queryKey: ["profile", wallet?.account.address],
        queryFn: () => {
          return getProfile(wallet!, addr as any)
        },
        enabled: !!wallet
      });


    return (
        <Skeleton loading={!isSuccess}>
                {profile && <div className="mli card">
                    <div className="mli__avatar">
                        <Avatar label={profile!.display} src={profile!.avatar}/>
                    </div>
                    <div className="mli__name">{profile?.display}</div>
                    <div className="mli__buttons">
                        <a onClick={() => {}}>
                            <CrossSVG className="mli__cross"/>
                        </a>
                    </div>
                </div>}
        </Skeleton>
    );
}

export default MembersListItem;
