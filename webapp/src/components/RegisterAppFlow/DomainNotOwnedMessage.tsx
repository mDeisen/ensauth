"use client"
import { FC } from "react";

const DomainNotOwnedMessage: FC = () => {
  return (
    <div>
      You are not the owner of this ENS record. Only owners are allowed to register applications.
    </div>
  );
}

export default DomainNotOwnedMessage;
