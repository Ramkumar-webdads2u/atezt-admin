"use client";

import { useEffect } from "react";
import NetworkErrorUI from "../network-error";
import { useParams } from "next/navigation";

export default function NetworkErrorPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    // if user navigates back to network-error but connection is fine, redirect away
    const redirectPath = sessionStorage.getItem("redirect_after_network");
    if (!redirectPath) {
      // no saved path means they got here via back button after retry
      window.location.replace(`/${locale}/dashboard`);
    }
  }, []);

  return <NetworkErrorUI />;
}