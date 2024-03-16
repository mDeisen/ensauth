"use client"
import { getOwner } from "@/lib/ens";
import { useQuery } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";

export default function Profile() {
  const {data: wallet} = useWalletClient()
  const { status, data, isSuccess, error } = useQuery({
    queryKey: ["getEnsOwner", "eauth.eth"],
    queryFn: () => {
      if (!wallet) {
        throw new Error("Wallet is undefined");
      }
      return getOwner(wallet, "eauth.eth")
    }
  })

  return (
    <>
      <section className="section">
        <div className="title">
            Your profile
        </div>
      </section>
      <section className="section">
        <div>
          Status: {status}
        </div>
        {isSuccess && <div>
          Owner: {data}
        </div>}
        {error && <div>
          {error.message}  
        </div>}
      </section>
    </>
  );
}
