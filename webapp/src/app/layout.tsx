import ConnectKitWrapper from "@/components/ConnectKitWrapper";
import ThorinWrapper from "@/components/ThorinWrapper";
import type { Metadata } from "next";
import "@/styles/index.scss"

export const metadata: Metadata = {
  title: "ENS Auth",
  description: "Adding a permission layer to ENS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="container is-max-desktop">
          <ConnectKitWrapper>
            <ThorinWrapper>
              {children}
            </ThorinWrapper>
          </ConnectKitWrapper>
        </div>
      </body>
    </html>
  );
}
