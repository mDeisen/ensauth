"use client"
import { FC } from "react";

const RegisterNowPrompt: FC = () => {
  return (
    <>
        <div>
        You are the owner of this ENS domain. You may register it here to manage permissions for your users.
        </div>
        <div>
            <button className="button is-primary">
                Register
            </button>
        </div>
    </>
  );
}

export default RegisterNowPrompt;