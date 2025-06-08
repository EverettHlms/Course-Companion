import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"; 
  import { Button } from "@/components/ui/button";
  import { Course } from "@/App"; 
  import { Trash2 } from "lucide-react";
  
  type ScheduleSidebarProps = {
    schedule: Course[];
    removeFromSchedule: (courseCode: string) => void;
  };
  
  export const ScheduleSidebar: React.FC<ScheduleSidebarProps> = ({schedule, removeFromSchedule,}) => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 z-50 cursor-pointer">
            Saved Schedule ({schedule.length})
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[350px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Saved Schedule</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {schedule.length === 0 && <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No courses added yet.</div>}
            {schedule.map((course) => (
              <div
              key={course.course_code}
              className="border rounded-lg p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{course.course_name}</p>
                <p className="text-xs text-muted-foreground">{course.course_code}</p>
                {course.professor_name && (<p className="text-xs text-muted-foreground italic">{course.professor_name}</p>)}
              </div>
              <button
                onClick={() => removeFromSchedule(course.course_code)}
                className="text-red-500 hover:text-red-700 transition cursor-pointer"
                aria-label="Remove course"
              >
                <Trash2 size={18} />
              </button>
            </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  };
  