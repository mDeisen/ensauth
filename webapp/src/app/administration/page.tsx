"use client"
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik"
import cx from "classnames"
import { useWalletClient } from "wagmi";
import { FieldSet, Input } from "@ensdomains/thorin"
import { wrapSubdomain } from "@/lib/ens";

export default function Administration() {
  const { data: wallet } = useWalletClient()

    const { mutate, data, error, status, isPending} = useMutation({
      mutationFn: (vars: {subdomain: string, newOwner: `0x${string}`}) => {
        if (!wallet) {
          throw new Error("Wallet is undefined");
        }

        return wrapSubdomain(wallet, vars.subdomain, vars.newOwner);
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
            <FieldSet legend="Wrap and send domain name" className="block">
              <Field as={Input} label="Subdomain" placeholder="groups.example.com" name="subdomain"/>
              <Field as={Input} label="New owner" placeholder="1234..." prefix="0x" name="newOwnerWithout0x"/>
            </FieldSet>
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
          {error && <div>
            {error.message}
          </div>}
        </div>
      </section>
    </>
  );
}
