"use client"
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import cx from "classnames";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wrapSubdomain } from "@/lib/ens";
import { delegatedDomain } from "@/lib/eauth";
import { useWalletClient } from "wagmi";

const RegisterAppFlow: FC<{step: number}> = ({ step }) => {
    const { label: appLabel } = useParams();
    const path = usePathname();
    const { data: wallet } = useWalletClient();
    const qc = useQueryClient();

    const subdomain = delegatedDomain(appLabel.toString())

    const { mutate: registerApp, isPending: registrationPending } = useMutation({
        mutationFn: () => {
          if (!wallet) throw new Error("Wallet not defined");
          return wrapSubdomain(wallet!, subdomain, process.env.NEXT_PUBLIC_EAUTH_CONTRACT_ADDR as any);
        },
        // Cache update
        onSuccess: () => qc.setQueryData(["appRegistered", appLabel], true)
      })

  return (
    <ul className="steps has-content-centered">
      <li className={cx("steps-segment", {"is-active": step <= 1})}>
        <span className="steps-marker">1</span>
        <div className="steps-content">
            <div className="is-size-5">
                Register ENS domain
            </div>
            {
                step <= 1
                ? <div>
                    Go to <a href={`https://ens.domains/${appLabel}`}>ens.domains/{appLabel}</a> to get an ENS domain for your app.
                </div>
                : <div>
                    Your are the owner of the ENS domain '{appLabel}'.
                </div>
            }
        </div>
      </li>
      <li className={cx("steps-segment", {"is-active": step === 2})}>
        <span className="steps-marker">2</span>
        <div className="steps-content">
            <div className="is-size-5">
                Register app for ENS auth
            </div>
            {
                step <= 2
                ? <div>
                    Delegate the subdomain '{process.env.NEXT_PUBLIC_AUTH_PREFIX}.{appLabel}' to {process.env.NEXT_PUBLIC_EAUTH_CONTRACT_NAME}.
                    This will set {process.env.NEXT_PUBLIC_EAUTH_CONTRACT_NAME} as your group resolver and let you manage permission through ENS.
                </div>
                : <div>
                    '{process.env.NEXT_PUBLIC_AUTH_PREFIX}/{appLabel}' resolves to the group resolver.
                    You can now use {process.env.NEXT_PUBLIC_EAUTH_CONTRACT_NAME} to manage identities through ENS.
                </div>
            }
            { step === 2 && <div>
                <button className={cx("button is-primary", {"is-loading": registrationPending})} onClick={() => registerApp()}>
                    Click here to start
                </button>
            </div>}
        </div>
      </li>
      <li className={cx("steps-segment", {"is-active": step === 3})}>
        <span className="steps-marker">3</span>
        <div className="steps-content">
            <div className="is-size-5">
                Create your first group
            </div>
            {
                step <= 3
                ? <div>
                    Create the first group for {appLabel} and add users to it.
                </div>
                : <div>
                    You have started creating groups and users.
                </div>
            }
            {
                step >= 3 && <div>
                    <Link href={`${path}/groups`}>
                        <button className="button is-primary">
                            Manage groups
                        </button>
                    </Link>
                </div>
            }
        </div>
      </li>
      <li className={cx("steps-segment", {"is-active": step >= 4})}>
        <span className="steps-marker">4</span>
        <div className="steps-content">
            <div className="is-size-5">
                Query group memberships from your app
            </div>
            <div>
                Use ENS text records to check group memberships. 
                Read our <a className="link" href="#">docs</a> and <a className="link" href="#">examples</a> to learn more.
            </div>
        </div>
      </li>
    </ul>
  );
}

export default RegisterAppFlow;
