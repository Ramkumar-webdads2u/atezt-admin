// "use client";

// import { ReactNode, useEffect, useState } from "react";
// import { usePathname, useRouter } from "@/components/navigation";
// import { getAccessToken } from "./authCookie";

// interface AuthGuardProps {
//   children: ReactNode;
// }

// const AuthGuard = ({ children }: AuthGuardProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (pathname?.includes("network-error")) {
//       setLoading(false);
//       return;
//     }

//     const token = getAccessToken();

//     // next-intl's usePathname() returns the pathname without the locale.
//     const isLoginPage =
//       pathname === "/" || pathname === "/auth/login";

//     if (!token && !isLoginPage) {
//       router.replace("/");
//       return;
//     }

//     // Browser Back → login is immediately replaced by dashboard
//     // while the auth cookie is still present.
//     if (token && isLoginPage) {
//       router.replace("/dashboard");
//       return;
//     }

//     setLoading(false);
//   }, [pathname, router]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

// export default AuthGuard;

"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "@/components/navigation";
import { getAccessToken } from "./authCookie";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname?.includes("network-error")) {
      setLoading(false);
      return;
    }

    const token = getAccessToken();

    const isLoginPage = pathname === "/" || pathname === "/auth/login";

    // No token → protected route → login
    if (!token && !isLoginPage) {
      router.replace("/");
      return;
    }

    // Token exists → login page → dashboard
    if (token && isLoginPage) {
      router.replace("/dashboard");
      return;
    }

    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
