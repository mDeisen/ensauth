"use client"

import { wrapSubdomain } from "@/lib/ens";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik"

export default function Administration() {
    const { mutate, data, error, status } = useMutation({
      mutationFn: (vars: {subdomain: string, newOwner: `0x${string}`}) => {
        return wrapSubdomain(vars.subdomain, vars.newOwner);
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
          className="section"
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
              <button type="submit" className="button is-primary">
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </section>
    </>
  );
}
