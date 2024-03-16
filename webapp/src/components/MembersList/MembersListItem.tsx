"use client"
import { removeUserFromGroup } from "@/lib/eauth";
import { getProfile } from "@/lib/ens";
import { Avatar, CrossSVG, Skeleton } from "@ensdomains/thorin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FC } from "react";
import { useWalletClient } from "wagmi";

const MembersListItem: FC<{ addr: string }> = ({ addr }) => {
    const { data: wallet } = useWalletClient();
    const { label: appLabel, group } = useParams();
    const qc = useQueryClient();
    const { data: profile, isSuccess } = useQuery({
        queryKey: ["profile", wallet?.account.address],
        queryFn: () => {
          return getProfile(wallet!, addr as any)
        },
        enabled: !!wallet
      });
    const { mutate: removeMember } = useMutation({
        mutationFn: () => {
            if (!wallet) throw new Error("Wallet is undefined");
            return removeUserFromGroup(wallet, appLabel.toString(), addr, group.toString())
        },
        onSuccess: () => {qc.invalidateQueries({queryKey: ["members", appLabel, group]})},
        onMutate: () => {qc.setQueryData(["members", appLabel, group], (old: string[]): string[] => old.filter((m) => m !== addr))}
    }) 


    return (
        <Skeleton loading={!isSuccess}>
                {profile && <div className="mli card">
                    <div className="mli__avatar">
                        <Avatar label={profile!.display} src={profile!.avatar}/>
                    </div>
                    <div className="mli__name">{profile?.display}</div>
                    <div className="mli__buttons">
                        <a onClick={() => {removeMember()}}>
                            <CrossSVG className="mli__cross"/>
                        </a>
                    </div>
                </div>}
        </Skeleton>
    );
}

export default MembersListItem;
