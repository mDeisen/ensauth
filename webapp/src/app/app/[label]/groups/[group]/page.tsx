"use client"
import AddMemberField from "@/components/AddMemberField";
import MembersList from "@/components/MembersList";
import { listGroupMembers } from "@/lib/eauth";
import { Skeleton } from "@ensdomains/thorin";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useWalletClient } from "wagmi";

export default function Administration() {
  const { group, label: appLabel } = useParams();
  const {data: wallet} = useWalletClient();
  const { data: members, isSuccess } = useQuery({
    queryKey: ["members", appLabel, group],
    queryFn: () => listGroupMembers(wallet!, appLabel.toString(), group.toString()),
    enabled: !!wallet
  });

  return (
    <>
      <div className="title is-5">
        Group: {group}
      </div>
      <AddMemberField/>
      <Skeleton loading={!isSuccess}>
        {members && <MembersList groupMembers={members}/>}
      </Skeleton>
    </>
  );
}
