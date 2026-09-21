export const siteConfig = {
  name: "NextCode",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description: "ATEZT Admin Panel",
  links: {
    twitter: "#",
    github: "#",
  },
};

export type SiteConfig = typeof siteConfig;
