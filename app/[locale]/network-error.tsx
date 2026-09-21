"use client";

import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function NetworkErrorUI() {
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const handleRetry = () => {
    setChecking(true);
    setFailed(false);
    window.location.replace(`/${locale}/dashboard`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center py-20 bg-background">
      <Image src="/images/all-img/404-2.svg" alt="" height={300} width={300} />
      <div className="max-w-136.5 mx-auto w-full mt-12">
        <h4 className="text-default-900 mb-4">Something went wrong</h4>
        <div className="dark:text-white text-base font-normal mb-10">
          Please try loading the dashboard again.
        </div>
        {failed && (
          <p className="text-sm text-destructive mb-4">Please try again.</p>
        )}
      </div>
      <div className="max-w-75 mx-auto w-full">
        <button
          onClick={handleRetry}
          disabled={checking}
          className="btn bg-default-300 hover:bg-default-300/50 transition-all duration-150 flex items-center justify-center gap-2 w-full rounded-md py-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Loading..." : "Try Again"}
        </button>
      </div>
    </div>
  );
}
