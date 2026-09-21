import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ATEZT",
  description: "ATEZT",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
