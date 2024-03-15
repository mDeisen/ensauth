import ConnectKitWrapper from "@/components/ConnectKitWrapper";
import ThorinWrapper from "@/components/ThorinWrapper";
import type { Metadata } from "next";
import "@/styles/index.scss"
import localFont from "next/font/local"

export const metadata: Metadata = {
  title: "ENS Auth",
  description: "Adding a permission layer to ENS",
};

const satoshi = localFont({src: [
  {path: "./fonts/Satoshi-Variable.ttf", style: "normal"},
  {path: "./fonts/Satoshi-VariableItalic.ttf", style: "italic"}
]})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.className}`}>
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
