"use client"
import { useParams } from "next/navigation";

export default function Administration() {
  const { group } = useParams()

  return (
    <>
      <div className="title is-5">
        Group: {group}
      </div>
      <div>Add member</div>
      <div className="title is-6">
        Members
      </div>
    </>
  );
}
