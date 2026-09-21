"use client";

import { Link } from "@/components/navigation";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import FooterContent from "./footer-content";

const NextCodeFooter = () => {
  return (
    <FooterContent>
      <div className="md:flex justify-between text-default-600 hidden">
        <div className="text-center md:ltr:text-start md:rtl:text-right text-sm">
          COPYRIGHT © {new Date().getFullYear()} ATEZT, All rights Reserved
        </div>
      </div>

      <div className="flex md:hidden justify-around items-center">
        <Link href="/dashboard" className="text-default-600">
          <div>
            <span className="block text-xs text-white dark:text-default-300">
              Dashboard
            </span>
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="relative bg-card bg-no-repeat backdrop-filter backdrop-blur-2xl rounded-full footer-bg dark:bg-default-300 h-16 w-16 z-[-1] -mt-10 flex justify-center items-center"
        >
          <div className="h-12 w-12 rounded-full relative custom-dropshadow">
            <Image
              src="/profile.jpeg"
              alt="Profile"
              width={50}
              height={50}
              unoptimized
              className="w-full h-full rounded-full border-2"
            />
          </div>
        </Link>

        <Link href="/dashboard" className="text-default-600">
          <Icon icon="heroicons-outline:bell" className="text-[20px]" />
          <span className="block text-xs">Notifications</span>
        </Link>
      </div>
    </FooterContent>
  );
};

export default NextCodeFooter;
