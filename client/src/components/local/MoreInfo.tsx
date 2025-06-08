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


export const MoreInfo: React.FC<CourseCardProps> = ({ title, code, description, prerequisites, credits, attributes, grademode }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">More Info</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" forceMount onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Credits */}
                    <div className="mb-4 min-h-[60px]">
                        <p className="text-sm font-medium mb-1">Credits</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {credits?.trim() || "N/A"}
                        </p>
                    </div>

                    {/* Attributes */}
                    <div className="mb-4 min-h-[40px]">
                        <p className="text-sm font-medium mb-1">Attributes</p>
                        <p className="text-sm text-muted-foreground">{attributes?.trim() || "N/A"}</p>
                    </div>

                    {/* Grading Mode */}
                    <div>
                        <p className="text-sm font-medium mb-1">Grading Mode</p>
                        <p className="text-sm text-muted-foreground">{grademode?.trim() || "N/A"}</p>
                    </div>
                </div>
                <DialogFooter>
                    {/* <Button type="submit">Save changes</Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}