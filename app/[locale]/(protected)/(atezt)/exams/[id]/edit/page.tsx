import SiteBreadcrumb from "@/components/site-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import ExamFormPage from "@/components/exams/ExamFormPage";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditExamPage({
    params,
}: PageProps) {
    const { id } = await params;

    return (
        <>
            <SiteBreadcrumb />
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-0">
                        <ExamFormPage
                            mode="edit"
                            examId={Number(id)}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}