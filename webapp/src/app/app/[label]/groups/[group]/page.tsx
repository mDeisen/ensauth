"use client"
import AddMemberField from "@/components/AddMemberField";
import { useParams } from "next/navigation";

export default function Administration() {
  const { group } = useParams()

  return (
    <>
      <div className="title is-5">
        Group: {group}
      </div>
      <AddMemberField/>
      <div className="title is-6">
        Members
      </div>
    </>
  );
}
