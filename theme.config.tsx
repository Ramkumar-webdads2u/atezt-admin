import React from "react";
import NextCodeLogo from "@/components/nextcode-logo";

const config = {
  logo: (
    <span className="inline-flex items-center gap-2.5">
      <NextCodeLogo className="text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" />
      <span className="text-lg font-bold text-default">NextCode</span>
    </span>
  ),
  project: {
    link: "#",
  },
  banner: {
    key: "atezt",
    text: <span>ATEZT Admin Panel</span>,
  },
  footer: {
    text: <span>{new Date().getFullYear()} © ATEZT</span>,
  },
  themeSwitch: {
    useOptions() {
      return {
        light: "Light",
        dark: "Dark",
        system: "System",
      };
    },
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – NextCode",
    };
  },
};

export default config;
