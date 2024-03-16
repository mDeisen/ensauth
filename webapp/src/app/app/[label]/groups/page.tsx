"use client"
import { useQuery } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { useParams } from "next/navigation";
import { listGroups } from "@/lib/eauth";
import GroupsList from "@/components/GroupsList";
import { Skeleton } from "@ensdomains/thorin";
import AddGroupField from "@/components/AddGroupField";

export default function Administration() {
  const { data: wallet } = useWalletClient();
  const { label: appLabel } = useParams();

    const { data: groups, isSuccess } = useQuery({
      queryKey: ["groups", "appLabel"],
      queryFn: () => listGroups(wallet!, appLabel.toString()),
      enabled: !!wallet
    })

  return (
    <>
      <div className="title is-5">
        Groups
      </div>
      <AddGroupField/>
      <Skeleton loading={!isSuccess}>
        <div className="block">
          {groups && <GroupsList groups={groups}/>}
        </div>
      </Skeleton>
    </>
  );
}
