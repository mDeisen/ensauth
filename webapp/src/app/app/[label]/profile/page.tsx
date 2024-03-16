"use client"
import { getProfile } from "@/lib/ens";
import { Skeleton, SkeletonGroup, Textarea, Profile as EnsProfile, Tag } from "@ensdomains/thorin";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useWalletClient } from "wagmi";

export default function Profile() {
  const {data: wallet} = useWalletClient()
  const { isSuccess, data: profile, error, status } = useQuery({
    queryKey: ["profile", wallet?.account.address],
    queryFn: () => {
      return getProfile(wallet!, wallet!.account.address)
    },
    enabled: !!wallet
  })

  return (
    <>
      <div className="title is-5">
          Your profile
      </div>
      <div className="block">
        <SkeletonGroup loading={!profile}>
          <Skeleton>
            <EnsProfile
              address={profile?.address ?? ""}
              avatar={profile?.avatar}
              ensName={profile?.display}
              size="large"
            />
          </Skeleton>
          <Skeleton>
            <Textarea label="Description" readOnly disabled={!profile?.description} value={profile?.description}/>
          </Skeleton>
          <Skeleton>
            {profile?.["com.twitter"] && <Link href={`https://twitter.com/${profile["com.twitter"]}`}>
              <Tag>Twitter: {profile["com.twitter"]}</Tag>
            </Link>}
            {profile?.url && <Link href={`https://${profile.web}`}>
              <Tag>Web: {profile.web}</Tag>
            </Link>}
          </Skeleton>
        </SkeletonGroup>
      </div>
    </>
  );
}
