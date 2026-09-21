import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ExamsList from "./ExamsList";

function DashbaordPage() {
  return (
    <>
      <SiteBreadcrumb />
      <div className="space-y-6">
        <Card>
          <CardContent className="p-0">
            <ExamsList />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default DashbaordPage;
