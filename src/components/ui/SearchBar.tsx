
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ placeholder = "Search...", className, onChange }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        type="search" 
        placeholder={placeholder} 
        className="pl-8 w-full border-none bg-secondary"
        onChange={(e) => onChange?.(e.target.value)} 
      />
    </div>
  );
}
