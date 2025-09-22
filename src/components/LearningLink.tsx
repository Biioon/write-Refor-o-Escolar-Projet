import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export const LearningLink = () => {
  return (
    <Link to="/learning">
      <Button variant="outline" size="sm" className="gap-2">
        <GraduationCap className="h-4 w-4" />
        Aprendizado Infantil
      </Button>
    </Link>
  );
};