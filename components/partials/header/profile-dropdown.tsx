"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "@/components/navigation";
import { clearAuthCookies } from "@/services/authCookie";
import { showToast } from "@/lib/toastSonner";

const ProfileDropdown = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    right: 0,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 10,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleResize = () => {
      updatePosition();
    };

    const handleScroll = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleToggle = () => {
    if (!open) {
      updatePosition();
    }

    setOpen((prev) => !prev);
  };

  const handleLogout = () => {
    clearAuthCookies();

    setOpen(false);

    showToast.success("Logged out successfully");

    router.replace("/");
    router.refresh();
  };

  return (
    <>
      {/* Profile Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 rounded-full outline-none"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          A
        </div>

        {/* User Info */}
        <div className="hidden text-left lg:block">
          <p className="text-sm font-medium leading-none">
            Admin
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Administrator
          </p>
        </div>

        <ChevronDown
          className={`hidden h-4 w-4 text-muted-foreground transition-transform lg:block ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popup */}
      {open && (
        <div
          ref={dropdownRef}
          style={{
            top: position.top,
            right: position.right,
          }}
          className="fixed z-[9999] w-72 overflow-hidden rounded-xl border bg-background shadow-xl"
        >
          {/* Profile Header */}
          <div className="flex items-center gap-3 border-b p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Admin
              </p>

              {/* <p className="truncate text-xs text-muted-foreground">
                admin@atezt.com
              </p> */}
            </div>
          </div>

          {/* Menu */}
          <div className="p-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;