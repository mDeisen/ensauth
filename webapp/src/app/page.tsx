"use client"
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const { isConnected } = useAccount();
  return (
    <>
      <section className="hero is-small is-primary">
        <div className="hero-body">
          <div className="title">
            ENS Auth
          </div>
          <div className="subtitle">
            A permission system for Web3
          </div>
        </div>
      </section>
      <section className="section">
        <ConnectKitButton/>
      </section>
      {isConnected
      ? <section className="section">
        <div className="buttons">
          <Link className="button" href="/profile">
            Your profile
          </Link>
          <Link className="button" href="/profile">
            User administration
          </Link>
        </div>
      </section>
      : <section className="section">
        You have to connect with your wallet to continue
      </section>}
    </>
  );
}
