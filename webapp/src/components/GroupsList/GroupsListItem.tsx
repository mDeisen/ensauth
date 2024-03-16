"use client"
import { CrossSVG, SpannerSVG } from "@ensdomains/thorin";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";

const GroupsListItem: FC<{ groupName: string }> = ({ groupName }) => {
    const path = usePathname();

  return (
    <div className="gli__container">
        <div
            className="gli"
        >
            <div className="gli__name">
                {groupName}
            </div>
            <div className="gli_members">
                N members
            </div>
            <div className="gli__buttons">
                <a onClick={() => {}}>
                    <CrossSVG className="gli__cross"/>
                </a>
                <Link href={`${path}/${groupName}`}>
                    <SpannerSVG className="gli__edit"/>
                </Link>
            </div>
        </div>
    </div>
  );
}

export default GroupsListItem;
