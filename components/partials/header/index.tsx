import HeaderContent from "./header-content";
import Notifications from "./notifications";
import ThemeSwitcher from "./theme-switcher";
import { SidebarToggle } from "@/components/partials/sidebar/sidebar-toggle";
import { SheetMenu } from "@/components/partials/sidebar/menu/sheet-menu";
import HeaderLogo from "./header-logo";
import OrgHeaderInfo from "./OrgHeaderInfo";
import ProfileDropdown from "./profile-dropdown";

const NextCodeHeader = () => {
  return (
    <HeaderContent>
      <div className="flex min-w-fit items-center gap-3">
        <HeaderLogo />
        <SidebarToggle />
      </div>

      <OrgHeaderInfo />

      <div className="nav-tools flex min-w-fit items-center gap-3 md:gap-4">
        <ThemeSwitcher />
        <Notifications />
        <ProfileDropdown />
        <SheetMenu />
      </div>
    </HeaderContent>
  );
};

export default NextCodeHeader;