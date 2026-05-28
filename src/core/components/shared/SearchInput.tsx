"use client";

import { useEffect, useState } from "react";
import { Input } from "@/core/components/ui";
import { Search } from "lucide-react";

interface SearchInputProps {
  onSearch: (val: string) => void;
  placeholder?: string;
}

export function SearchInput({
  onSearch,
  placeholder = "Buscar",
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [localValue, onSearch]);

  return (
    <Input
      placeholder={placeholder}
      size="sm"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      leftElement={Search}
      wrapperClassName="max-w-xs"
    />
  );
}
