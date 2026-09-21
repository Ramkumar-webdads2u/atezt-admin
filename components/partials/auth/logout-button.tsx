// "use client";

// import { Icon } from "@/components/ui/icon";
// import { clearToken } from "@/services/authService";
// import { useRouter } from "@/components/navigation";

// const LogoutButton = () => {
//   const router = useRouter();

//   const handleLogout = () => {
//     clearToken();
//     router.replace("/");
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600"
//     >
//       <Icon icon="heroicons:power" className="w-4 h-4" />
//       Log out
//     </button>
//   );
// };

// export default LogoutButton;

"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "@/components/navigation";
import { clearToken } from "@/services/authService";
import { showToast } from "@/lib/toastSonner";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication cookies
    clearToken();

    // Prevent protected page from being restored from browser history
    router.replace("/");

    // Refresh the route state
    router.refresh();

    showToast.success("Logged out successfully");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2 text-xs text-red-500 transition-colors hover:text-red-600"
    >
      <LogOut className="h-4 w-4" />
      <span>Log out</span>
    </button>
  );
};

export default LogoutButton;
