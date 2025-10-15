import { useState, useMemo } from "react";
import { Check, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { languages } from "@/data/languages";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LanguageSelector({ value, onChange, placeholder = "Select language..." }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return languages;
    
    const query = searchQuery.toLowerCase();
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.nativeName.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedLanguage = languages.find((lang) => lang.code === value);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-primary/20 text-primary font-semibold">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background"
        >
          {selectedLanguage ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedLanguage.name}</span>
              <span className="text-muted-foreground">({selectedLanguage.nativeName})</span>
            </span>
          ) : (
            placeholder
          )}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-background" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search languages..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto">
            {filteredLanguages.length === 0 ? (
              <CommandEmpty>No language found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredLanguages.map((language) => (
                  <CommandItem
                    key={language.code}
                    value={language.code}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {highlightText(language.name, searchQuery)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {highlightText(language.nativeName, searchQuery)}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === language.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
