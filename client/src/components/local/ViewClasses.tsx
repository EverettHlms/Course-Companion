import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CourseCardProps } from "./CourseCard"
import { useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";


type ViewClassesProps = CourseCardProps & {
    onAddToSchedule?: (section: {
      course_code: string;
      course_name: string;
      professor_name: string;
    }) => void;
  };
  
  export const ViewClasses: React.FC<ViewClassesProps> = ({
    title,
    code,
    onAddToSchedule,
    description,
    prerequisites,
    credits,
    attributes,
    grademode,
  }) => {

    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    const fetchClasses = async (courseCode: string) => {
        setLoading(true); // start loading
        try {
            const res = await axios.get("http://localhost:5000/view_courses", {
                params: { course_code: courseCode },
            });
            setClasses(res.data);
        } catch (err) {
            console.error("Error fetching classes", err);
        } finally {
            setLoading(false); // done loading
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" onClick={() => fetchClasses(code)}>View Classes</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading && (
                        <>
                            <Skeleton className="h-[120px] rounded-xl" />
                            <Skeleton className="h-[120px] rounded-xl" />
                        </>
                    )}

                    {!loading && classes.length === 0 ? (
                        <p>No classes found.</p>
                    ) : (
                        !loading && classes.map((c, index) => (
                            <div key={index} className="border p-4 rounded-lg bg-card flex flex-col justify-between">
                              <div>
                                <h3 className="text-lg font-semibold">{c.professor}</h3>
                                <p>
                                  <a href={c.syllabus} target="_blank" className="text-blue-400">
                                    View Syllabus
                                  </a>
                                </p>
                                <p>
                                  <a href={c.rate_my_professor_url} target="_blank" className="text-blue-400">
                                    Rate My Professor
                                  </a>
                                </p>
                              </div>
                              {onAddToSchedule && (
                                <Button
                                  onClick={() =>
                                    onAddToSchedule({
                                      course_code: code,
                                      course_name: title,
                                      professor_name: c.professor,
                                    })
                                  }
                                  className="mt-2 cursor-pointer"
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}