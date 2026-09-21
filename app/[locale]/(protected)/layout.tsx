import LayoutProvider from "@/providers/layout.provider";
import LayoutContentProvider from "@/providers/content.provider";
import NextCodeSidebar from "@/components/partials/sidebar";
import NextCodeFooter from "@/components/partials/footer";
import NextCodeHeader from "@/components/partials/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <LayoutProvider>
      <NextCodeHeader />
      <NextCodeSidebar />
      <LayoutContentProvider>{children}</LayoutContentProvider>
      <NextCodeFooter />
    </LayoutProvider>
  );
};

export default Layout;
