import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ExamFormPage from "@/components/exams/ExamFormPage";

export default function CreateExamPage() {
    return (
        <>
            <SiteBreadcrumb />
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-0">
                        <ExamFormPage mode="create" />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}