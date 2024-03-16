"use client"
import { delegatedDomain } from "@/lib/eauth";
import { wrapSubdomain } from "@/lib/ens";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FC } from "react";
import { useWalletClient } from "wagmi";

const RegisterNowPrompt: FC = () => {
  const { label: appLabel } = useParams();
  const { data: wallet } = useWalletClient();
  const qc = useQueryClient()
  const subdomain = delegatedDomain(appLabel.toString())

  const { mutate } = useMutation({
    mutationFn: () => {
      if (!wallet) throw new Error("Wallet not defined");
      return wrapSubdomain(wallet!, subdomain, process.env.NEXT_PUBLIC_EAUTH_CONTRACT_ADDR as any);
    },
    // Optimistic update
    onSuccess: () => qc.setQueryData(["appRegistered", appLabel], true)
  })

  return (
    <>
        <div>
          You are the owner of this ENS domain. You may register it here to manage permissions for your users.
        </div>
        <div>
          By registering, you are wrapping the subdomain "{subdomain}" and sending it
          to the identity contract.
        </div>
        <div>
            <button className="button is-primary" onClick={() => mutate()}>
                Register
            </button>
        </div>
    </>
  );
}

export default RegisterNowPrompt;
