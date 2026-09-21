import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import CouponList from "./CouponList";

function DashbaordPage() {
  return (
    <>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <CouponList />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default DashbaordPage;
