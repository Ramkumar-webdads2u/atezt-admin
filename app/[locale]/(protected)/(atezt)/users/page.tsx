import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import UsersList from "./UsersList";

function DashbaordPage() {
  return (
    <>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <UsersList />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default DashbaordPage;
