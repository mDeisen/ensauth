"use client"
import { getUsersGroups } from "@/lib/eauth";
import { getProfile } from "@/lib/ens";
import { Skeleton, SkeletonGroup, Textarea, Profile as EnsProfile } from "@ensdomains/thorin";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWalletClient } from "wagmi";

export default function Profile() {
  const { label: appLabel } = useParams();
  const { data: wallet } = useWalletClient();
  const { data: profile } = useQuery({
    queryKey: ["profile", wallet?.account.address],
    queryFn: () => {
      return getProfile(wallet!, wallet!.account.address)
    },
    enabled: !!wallet
  });
  const { data: groups } = useQuery({
    queryKey: ["groups", appLabel, wallet?.account.address],
    queryFn: () => {
      return getUsersGroups(wallet!, appLabel.toString(), wallet!.account.address)
    },
    enabled: !!wallet
  });

  return (
    <>
      <div className="title is-5">
          Your profile
      </div>
      <SkeletonGroup loading={!profile}>
        <div className="block">
          <Skeleton>
            <EnsProfile
              address={profile?.address ?? ""}
              avatar={profile?.avatar}
              ensName={profile?.display}
              size="large"
            />
          </Skeleton>
        </div>
        <div className="block">
          <Skeleton>
            <Textarea label="Description" readOnly disabled={!profile?.description} value={profile?.description}/>
          </Skeleton>
          <Skeleton>
            <div className="tags">
              {profile?.["com.twitter"] && <Link href={`https://twitter.com/${profile["com.twitter"]}`}>
                <span className="tag is-info is-medium">Twitter: {profile["com.twitter"]}</span>
              </Link>}
              {profile?.url && <Link href={`https://${profile.web}`}>
                <span className="tag is-white is-medium">Web: {profile.web}</span>
              </Link>}
            </div>
          </Skeleton>
        </div>
        <div className="block">
          <div className="title is-6">Groups</div>
          {groups?.length
          ? <div className="tags">{groups.map((g) => 
            <span className="tag is-light" key={`g-${g}`}>{g}</span>)}
          </div>
          : <em>No memberships</em>
          }
        </div>
      </SkeletonGroup>
    </>
  );
}
