import { FC, ReactNode } from "react";

const GroupsPage: FC<{ children: ReactNode}> = ({ children }) => {
  return (
    <>
      <div className="title">
        User administration
      </div>
      {children}
    </>
  );
}

export default GroupsPage;