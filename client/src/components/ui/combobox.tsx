import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxDemoProps {
  onChange: (selectedValue: string) => void;
}

const types = [
  {
    value: "time",
    label: "Time Created",
  },
  {
    value: "due",
    label: "Due Date",
  },
  {
    value: "alphabet",
    label: "Alphabet",
  },
];

export function ComboboxDemo({ onChange }: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  function selectValue(selectedValue: string) {
    setValue(selectedValue === value ? "" : selectedValue);
    setOpen(false);

    // Call the onChange prop with the selected value
    onChange(selectedValue === value ? "" : selectedValue);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? types.find((type) => type.value === value)?.label
            : "Sort by"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Sort by..." />
          <CommandEmpty>None found!</CommandEmpty>
          <CommandGroup>
            {types.map((type) => (
              <CommandItem
                key={type.value}
                value={type.value}
                onSelect={selectValue} // Use the selectValue function
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === type.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {type.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
