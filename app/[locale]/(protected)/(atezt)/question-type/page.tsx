import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import QuestionTypeList from "./QuestionTypeList";

function DashbaordPage() {
  return (
    <>
        <SiteBreadcrumb />
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <QuestionTypeList />
            </CardContent>
          </Card>
        </div>
    </>
  );
}

export default DashbaordPage;
