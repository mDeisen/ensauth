"use client"
import { FC } from "react";

const AppNotOwnedMessage: FC = () => {
  return (
    <div>
      You are not the owner of this ENS record. Only owners are allowed to manage permissions for the moment.
    </div>
  );
}

export default AppNotOwnedMessage;