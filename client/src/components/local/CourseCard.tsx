import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { MoreInfo } from "./MoreInfo";
import { ViewClasses } from "./ViewClasses";
import { AddToSchedule } from "./AddToSchedule";

export type CourseCardProps = {
    title: string;
    code: string;
    description: string;
    prerequisites?: string;
    credits?: string;
    attributes?: string;
    grademode?: string;
    onAddToSchedule?: (section:{
        course_code: string;
        course_name: string;
        professor_name: string;
    }) => void;
};

export const CourseCard: React.FC<CourseCardProps> = ({ title, code, description, prerequisites, credits, attributes, grademode, onAddToSchedule}) => {
    return (
        <Card className="w-[350px] flex flex-col">
            <CardHeader className="text-center">
                <CardTitle className="leading-tight truncate">{title}</CardTitle>
                <CardDescription>{code}</CardDescription>
            </CardHeader>

            <CardContent className="text-left flex-1">
                {/* Description */}
                <div className="mb-4 h-[120px]">
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm text-muted-foreground line-clamp-5">
                        {description}
                    </p>
                </div>

                {/* Prerequisites */}
                <div className="mb-4 min-h-[80px]">
                    <p className="text-sm font-medium mb-1">Prerequisites</p>
                    <p className="text-sm text-muted-foreground">
                        {prerequisites?.trim() || "N/A"}
                    </p>
                </div>
            </CardContent>

            <CardFooter className="flex flex-row justify-center mt-auto gap-4">
                {/* <Button variant="outline">View Courses</Button> */}
                <MoreInfo
                    title={title}
                    code={code}
                    description={description}
                    prerequisites={prerequisites}
                    credits={credits}
                    attributes={attributes}
                    grademode={grademode}
                />
                <ViewClasses
                    title={title}
                    code={code}
                    description={description}
                    prerequisites={prerequisites}
                    credits={credits}
                    attributes={attributes}
                    grademode={grademode}
                    onAddToSchedule={onAddToSchedule}
                />
            </CardFooter>
        </Card>
    );
};
