"use client"
import { FC } from "react";
import GroupsListItem from "./GroupsListItem";

const GroupsList: FC<{ groups: string[] }> = ({ groups }) => {
  return (
    <div className="gl">
        {groups.length 
        ? groups.map((g) => <GroupsListItem groupName={g} key={`gli-${g}`}/>)
        : <em>There are no groups, yet.</em>
      }
    </div>
  );
}

export default GroupsList;
