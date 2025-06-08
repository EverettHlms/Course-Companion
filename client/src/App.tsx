import { CourseCard } from "./components/local/CourseCard";
import { TranscriptUploader } from "./components/local/TranscriptUploader";
import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ScheduleSidebar } from "./components/local/ScheduleSidebar";
import { ThemeToggle } from "./components/local/ThemeToggle";
import { useEffect } from "react";

export type Course = {
    course_code: string;
    course_name?: string;
    course_desc?: string;
    course_credits?: string;
    course_attributes?: string;
    course_grademode?: string;
    course_prerequisites?: string;
    professor_name?: string;
};

const getPrerequisite = (desc: string): string => {
    const match = desc.match(/prerequisites?\s*:?\s*(.*)/i);
    return match ? match[1].trim() : "None";
};

function App() {
    const [coursesTaken, setCoursesTaken] = useState<Course[]>([]);
    const [coursesNotYetTaken, setCoursesNotYetTaken] = useState<Course[]>([]);

    const handleUploadComplete = (coursesTaken: Course[], coursesNotYetTaken: Course[]) => {
        setCoursesTaken(coursesTaken);
        setCoursesNotYetTaken(coursesNotYetTaken);
    };

    const [schedule, setSchedule] = useState<Course[]>(() => {
        const stored = localStorage.getItem("savedSchedule");
        return stored ? JSON.parse(stored) : [];
      });

      const addToSchedule = (section: Course) => {
        if (!schedule.some(c => c.course_code === section.course_code && c.professor_name === section.professor_name)) {
          setSchedule([...schedule, section]);
        }
      };

    useEffect(() => {
        localStorage.setItem("savedSchedule", JSON.stringify(schedule));
    }, [schedule]);
    const removeFromSchedule = (courseCode: string) => {
    setSchedule(schedule.filter(course => course.course_code !== courseCode));
  };

    return (
        <div className="min-h-screen text-foreground">
            {/* Top Banner */}
            <nav className="relative flex items-center justify-center px-6 py-3 border-b bg-[var(--nav-background)]">
                <span className="text-sm text-muted-foreground absolute left-1/2 transform -translate-x-1/2">
                    The content below is currently in preview.
                </span>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col items-center justify-center text-center pt-15 pb-10 gap-6">
                {/* Icon */}
                <div className="text-2xl">
                    <a
                        href="https://git.txstate.edu/wuq10/txst-cc"
                        target="_blank"
                        aria-label="GitHub"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="40"
                            height="40"
                            className="fill-foreground"
                        >
                            <title>GitHub</title>
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                    </a>

                </div>

                {/* Main Heading */}
                <h1 className="text-5xl font-bold tracking-tight font-[Geist]">TXST Course Companion</h1>

                {/* Upload Button */}
                <TranscriptUploader onUploadComplete={handleUploadComplete} />
            </div>

            {/* Course Section */}
            <div className="w-full max-w-screen-2xl rounded-lg border bg-transparent p-6 shadow-inner shadow-border mx-auto flex flex-row flex-wrap gap-4 justify-center">
                <Tabs defaultValue="courses-not-taken">
                    <TabsList className="w-full justify-center">
                        <TabsTrigger value="courses-taken" className="cursor-pointer">Courses Taken</TabsTrigger>
                        <TabsTrigger value="courses-not-taken" className="cursor-pointer">Courses Not Yet Taken</TabsTrigger>
                    </TabsList>
                    <TabsContent value="courses-not-taken">
                        <div className="flex flex-wrap justify-center gap-4">
                            {coursesNotYetTaken.map((course) => (
                                <CourseCard
                                    key={course.course_code}
                                    title={course.course_name || "Untitled"}
                                    code={course.course_code}
                                    description={(course.course_desc ?? "").replace(/prerequisites?\s*:?.*/i, "").trim() || "No description available."}
                                    prerequisites={getPrerequisite(course.course_desc || "")}
                                    credits={course.course_credits?.replace(/^\n/, "")}
                                    attributes={course.course_attributes}
                                    grademode={course.course_grademode}
                                    onAddToSchedule={addToSchedule}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="courses-taken">
                        <div className="flex flex-wrap justify-center gap-4">
                            {coursesTaken.map((course) => (
                                <CourseCard
                                    key={course.course_code}
                                    title={course.course_name || "Untitled"}
                                    code={course.course_code}
                                    description={(course.course_desc ?? "").replace(/prerequisites?\s*:?.*/i, "").trim() || "No description available."}
                                    prerequisites={getPrerequisite(course.course_desc || "")}
                                    credits={course.course_credits?.replace(/^\n/, "")}
                                    attributes={course.course_attributes}
                                    grademode={course.course_grademode}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <ScheduleSidebar schedule ={schedule}
            removeFromSchedule={removeFromSchedule} />
        </div>
    );
}

export default App;