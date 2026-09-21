"use client";
import { Loader2 } from "lucide-react";
import ShortLogo from "./partials/auth/shortLogo";
const LoaderTwo = () => {
  return (
    <div className=" h-screen flex items-center justify-center flex-col space-y-2">
      <div className="flex gap-2 items-center ">
        <ShortLogo />
        {/* <h1 className="text-xl font-semibold bg-gradient-to-r from-[#49C5FD] to-[#993DEC] text-transparent bg-clip-text ">
                    ATEZT
                </h1> */}
      </div>
      <span className=" inline-flex gap-1  items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </span>
    </div>
  );
};

export default LoaderTwo;
