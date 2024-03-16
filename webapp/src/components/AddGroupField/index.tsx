"use client"
import { Input } from "@ensdomains/thorin";
import { Field, Form, Formik } from "formik";
import { FC } from "react";
import cx from "classnames";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { createGroup } from "@/lib/eauth";
import { useParams } from "next/navigation";

const AddGroupField: FC = () => {
  const { data: wallet } = useWalletClient();
  const { label: appLabel } = useParams();
  const qc = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (vars: {newGroup: string}) => {
      if (!wallet) throw new Error("Wallet is undefined");
      return createGroup(wallet, appLabel.toString(), vars.newGroup)
    },
    onSuccess: () => {qc.invalidateQueries({queryKey: ["groups", "appLabel"]})}
  })

  return (
    <Formik initialValues={{newGroup: ""}} onSubmit={(vars) => mutate(vars)} validate={(vars) => {
      if (vars.newGroup.includes(" ")) {
        return {"newGroup": "Group name must not contain spaces"}
      }
      return {};
    }}>
      {(props) =>
        <Form className="add-groups-field">
          <Field as={Input} label="Create a new group" placeholder="ExampleGroup" name="newGroup" error={props.errors.newGroup}/>
          <button className={cx("button is-primary is-medium", {"is-loading": isPending})} type="submit" disabled={!props.isValid}>Create</button>
        </Form>
      }
    </Formik>
  );
}

export default AddGroupField;
