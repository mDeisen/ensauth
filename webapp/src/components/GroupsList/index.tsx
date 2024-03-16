"use client"
import { FC } from "react";
import GroupsListItem from "./GroupsListItem";

const GroupsList: FC<{ groups: string[] }> = ({ groups }) => {
  return (
    <div className="gl">
        {groups.map((g) => <GroupsListItem groupName={g} key={`gli-${g}`}/>)}
    </div>
  );
}

export default GroupsList;
