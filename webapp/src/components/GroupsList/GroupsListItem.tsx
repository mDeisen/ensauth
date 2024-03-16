"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

const GroupsListItem: FC<{ groupName: string }> = ({ groupName }) => {
    const path = usePathname();

  return (
    <div className="gli__container">
        <Link
            className="gli"
            href={`${path}/${groupName}`}
        >
            <div className="gli__name">
                {groupName}
            </div>
        </Link>
    </div>
  );
}

export default GroupsListItem;
