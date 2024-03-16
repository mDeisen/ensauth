"use client"

import { wrapSubdomain } from "@/lib/ens";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik"
import cx from "classnames"
import { useAccount, useTransaction } from "wagmi";

export default function Administration() {
  const { address } = useAccount();
  const { status: txStatus } = useTransaction({hash: "0x40852aa7ba9a0fd483f40995c1d65d9dd46a82e466f78955fa063e1d145a08c7"})

    const { mutate, data, error, status, isPending} = useMutation({
      mutationFn: (vars: {subdomain: string, newOwner: `0x${string}`}) => {
        if (!address) {
          throw new Error("Account address is undefined");
        }

        return wrapSubdomain(address, vars.subdomain, vars.newOwner);
      }
    })

  return (
    <>
      <section className="section">
        <div className="title">
            User administration
        </div>
      </section>
      <section>
        <div className="title is-4">
          Wrap and send domain name
        </div>
        <Formik 
          className="block"
          initialValues={{
            subdomain: "",
            newOwnerWithout0x: ""
          }}
          onSubmit={({subdomain, newOwnerWithout0x}) => 
            mutate({subdomain, newOwner: ("0x" + newOwnerWithout0x) as any})
          }
        >
          <Form>
            <p>Subdomain:</p>
            <Field name="subdomain"/>

            <p>New owner:</p>
            0x<Field name="newOwnerWithout0x"/>

            <div className="buttons is-right">
              <button type="reset" className="button is-outlined is-danger">
                Reset
              </button>
              <button type="submit" className={cx("button is-primary", {"is-loading": isPending})}>
                Submit
              </button>
            </div>
          </Form>
        </Formik>
        <div className="block">
          <div>
            Status: {status}
          </div>
          {data && <div>
            {data}
          </div>}
          {error && <div>
            {error.message}
          </div>}
          <div>
            Tx status: {txStatus}
          </div>
        </div>
      </section>
    </>
  );
}
