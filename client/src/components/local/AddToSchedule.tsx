import React from "react"
import { Button } from "@/components/ui/button"

type AddToScheduleProps = {
    onClick: () => void;
};


export const AddToSchedule: React.FC<AddToScheduleProps> = ({onClick}) => {
    return(
        <Button onClick={onClick} className="cursor-pointer">
            Add
        </Button>
    )
};