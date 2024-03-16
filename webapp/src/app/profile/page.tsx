"use client"
import { checkOwnership } from "@/lib/ens";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { status, data, isSuccess, error } = useQuery({
    queryKey: ["checkowner"],
    queryFn: () => {
        return checkOwnership("eauth.eth")
    },
    retry: false,
    
  })

  return (
    <>
      <section className="section">
        <div className="title">
            Your profile
        </div>
      </section>
      <section className="section">
        <div>
          Status: {status}
        </div>
        {isSuccess && <div>
          Owner: {data}
        </div>}
        {error && <div>
          {error.message}  
        </div>}
      </section>
    </>
  );
}
