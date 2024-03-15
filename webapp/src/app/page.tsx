"use client"
import { ConnectKitButton } from "connectkit";

export default function Home() {
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
        Hello Ethereum!
        <ConnectKitButton/>
      </section>
    </>
  );
}
