"use client";
import React from "react";
// import NextCodeLogo from "./nextcode-logo";
import { Link } from "@/i18n/routing";
import { useConfig } from "@/hooks/use-config";
import { useMenuHoverConfig } from "@/hooks/use-menu-hover";
import { useMediaQuery } from "@/hooks/use-media-query";
import ShortLogo from "./partials/auth/shortLogo";

const Logo = () => {
  const [config] = useConfig();
  const [hoverConfig] = useMenuHoverConfig();
  const { hovered } = hoverConfig;
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  if (config.sidebar === "compact") {
    return (
      <Link
        href="/dashboard"
        className="flex gap-2 items-center   justify-center    "
      >
        {/* <NextCodeLogo className="  text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" /> */}
        <ShortLogo />
      </Link>
    );
  }
  if (config.sidebar === "two-column" || !isDesktop) return null;

  return (
    <Link href="/dashboard" className="flex gap-2 items-center    ">
      {/* <NextCodeLogo className="  text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" /> */}
      <ShortLogo />
      {/* {(!config?.collapsed || hovered) && (
                <h1 className="text-xl font-semibold bg-gradient-to-r from-[#49C5FD] to-[#993DEC] text-transparent bg-clip-text">
                    ATEZT
                </h1>
            )} */}
    </Link>
  );
};

export default Logo;
