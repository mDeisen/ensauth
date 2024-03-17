"use client"
import { useModal } from "connectkit";
import { Input } from "@ensdomains/thorin";
import { useAccount } from "wagmi";
import cx from "classnames";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isConnected } = useAccount();
  const { push } = useRouter();
  const { setOpen: setModalOpen } = useModal()
  
  const openModal = () => setModalOpen(true);
  const navigateToApp = (label: string) => push(`/app/${label}`);

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
      <div className="container is-max-desktop">
        <section className={cx("section", {"is-hidden": isConnected})}>
          You have to connect with your wallet to continue. <a onClick={openModal} className="link">Click here to connect.</a>
        </section>
        <section className={cx("section", {"is-hidden": !isConnected})}>
          <Formik initialValues={{label: ""}} onSubmit={(vars) => navigateToApp(vars.label)}>
            <Form>
              <div className="block">
                <Field as={Input} label="Select your application" placeholder="example.com" name="label"/>
              </div>
              <div className="buttons">
                <button className="button is-primary" type="submit">
                  Manage
                </button>
              </div>
            </Form>
          </Formik>
        </section>
      </div>
      
    </>
  );
}
