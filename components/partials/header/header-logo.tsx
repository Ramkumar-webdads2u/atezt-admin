"use client";
import React from "react";
import { Link } from "@/components/navigation";
// import NextCodeLogo from "@/components/nextcode-logo"
import { useConfig } from "@/hooks/use-config";
import { useMediaQuery } from "@/hooks/use-media-query";
import ShortLogo from "../auth/shortLogo";

const HeaderLogo = () => {
  const [config] = useConfig();

  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return config.layout === "horizontal" ? (
    <Link href="/dashboard" className="flex gap-2 items-center    ">
      {/* <NextCodeLogo className="  text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" /> */}
      <ShortLogo />
      {/* <h1 className="text-xl font-semibold bg-gradient-to-r from-[#49C5FD] to-[#993DEC] text-transparent bg-clip-text lg:block hidden ">
                    ATEZT
                </h1> */}
    </Link>
  ) : (
    !isDesktop && (
      <Link href="/dashboard" className="flex gap-2 items-center    ">
        {/* <NextCodeLogo className="  text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" /> */}
        <ShortLogo />
        {/* <h1 className="text-xl font-semibold bg-gradient-to-r from-[#49C5FD] to-[#993DEC] text-transparent bg-clip-text lg:block hidden ">
                        ATEZT
                    </h1> */}
      </Link>
    )
  );
};

export default HeaderLogo;
