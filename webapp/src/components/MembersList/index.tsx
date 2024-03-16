"use client"
import { FC } from "react";
import MembersListItem from "./MembersListItem";

const MembersList: FC<{ groupMembers: string[] }> = ({ groupMembers }) => {
  return (
    <div className="ml">
        {groupMembers.length 
        ? groupMembers.map((m) => <MembersListItem key={`mli-${m}`} addr={m}/>)
        : <em>There are no members, yet.</em>
        }
    </div>
  );
}

export default MembersList;
