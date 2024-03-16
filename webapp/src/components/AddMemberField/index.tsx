"use client"
import { Input } from "@ensdomains/thorin";
import { Field, Form, Formik } from "formik";
import { FC } from "react";
import cx from "classnames";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { addUserToGroup } from "@/lib/eauth";
import { useParams } from "next/navigation";

const AddMemberField: FC = () => {
  const { data: wallet } = useWalletClient();
  const { label: appLabel, group } = useParams();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (vars: {newUser: string}) => {
      if (!wallet) throw new Error("Wallet is undefined");
      return addUserToGroup(wallet, appLabel.toString(), vars.newUser, group.toString())
    },
    onSuccess: () => {qc.invalidateQueries({queryKey: ["members", appLabel, group]})}
  })

  return (
    <Formik initialValues={{newUser: ""}} onSubmit={(vars) => mutate(vars)} validate={(vars) => {
      if (vars.newUser.includes(" ")) {
        return {"newUser": "New user must be an address or ENS name"}
      }
      return {};
    }}>
      {(props) =>
        <Form className="add-member-field">
          <Field as={Input} label="Add user to group" placeholder="0x1234..." name="newUser" error={props.errors.newUser}/>
          <button className={cx("button is-primary is-medium", {"is-loading": isPending})} type="submit" disabled={!props.isValid}>Create</button>
        </Form>
      }
    </Formik>
  );
}

export default AddMemberField;
