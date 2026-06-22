"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

const PERTH_SUBURBS = [
  "Joondalup",
  "Cannington",
  "Fremantle",
  "Midland",
  "Rockingham",
  "Armadale",
  "Baldivis",
  "Ellenbrook",
  "Perth CBD",
  "Scarborough",
  "Subiaco",
  "Claremont",
  "Morley",
  "Victoria Park",
  "Bayswater",
  "Cottesloe",
  "Nedlands",
  "Wanneroo",
  "Cockburn",
  "Gosnells"
];

interface SuburbInputProps {
  value: string;
  onChange: (suburb: string) => void;
  placeholder?: string;
  error?: boolean;
}

export function SuburbInput({ value, onChange, placeholder = "Enter your Perth suburb", error }: SuburbInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val); // Keep parent state in sync

    if (val.trim().length > 1) {
      const filtered = PERTH_SUBURBS.filter((suburb) =>
        suburb.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    setActiveIndex(-1);
  };

  const handleSelect = (suburb: string) => {
    setQuery(suburb);
    onChange(suburb);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
        } else if (suggestions.length > 0) {
          handleSelect(suggestions[0]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Scroll active list item into view if necessary
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 1) {
              const filtered = PERTH_SUBURBS.filter((suburb) =>
                suburb.toLowerCase().includes(query.toLowerCase())
              );
              setSuggestions(filtered);
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border bg-white py-3.5 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-300 shadow-sm",
            error
              ? "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500"
              : "border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-slate-300"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Autocomplete List */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-30 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          {suggestions.map((suburb, index) => (
            <li
              key={suburb}
              onClick={() => handleSelect(suburb)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200",
                index === activeIndex
                  ? "bg-sky-50 text-sky-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <MapPin className={cn("h-4 w-4 shrink-0", index === activeIndex ? "text-sky-600" : "text-slate-400")} />
              <span>{suburb}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Popular suburb suggestions click triggers */}
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-500 font-medium select-none mr-1">Popular:</span>
        {PERTH_SUBURBS.slice(0, 5).map((popSub) => (
          <button
            key={popSub}
            type="button"
            onClick={() => handleSelect(popSub)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 transition-all duration-300"
          >
            {popSub}
          </button>
        ))}
      </div>
    </div>
  );
}
