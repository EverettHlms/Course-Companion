import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() =>
        document.documentElement.classList.contains("dark")
    );

    const toggleTheme = () => {
        const html = document.documentElement;
        html.classList.toggle("dark");
        setIsDark(html.classList.contains("dark"));
    };

    return (
        <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            className="ml-auto"
        >
            {isDark ? "🌞" : "🌙"}
        </Button>
    );
};
