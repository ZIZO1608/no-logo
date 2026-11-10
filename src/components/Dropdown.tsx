"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { LogoMark } from "./Logo";

type Option<Value extends string> = { value: Value; label: string };

type Props<Value extends string> = {
  label: string;
  value: Value;
  options: Option<Value>[];
  onChange: (value: Value) => void;
};

/** The brand's own select: square, ink and paper, with the Ø mark on the chosen option. */
export function Dropdown<Value extends string>({ label, value, options, onChange }: Props<Value>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [isOpen]);

  const open = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;

    if (step) {
      event.preventDefault();
      if (!isOpen) return open();
      setActiveIndex((index) => (index + step + options.length) % options.length);
      return;
    }
    if (!isOpen) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Escape" || event.key === "Tab") {
      setIsOpen(false);
    }
  };

  const optionId = (index: number) => `${id}-option-${index}`;

  return (
    <div ref={rootRef} className="relative flex items-center gap-2">
      <span id={`${id}-label`} className="label text-ash">
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKey}
        className={`label flex h-9 items-center gap-3 border ps-3 pe-2 transition-colors ${
          isOpen ? "border-paper bg-paper text-ink" : "border-line text-paper hover:border-paper"
        }`}
      >
        <span id={`${id}-value`}>{options[selectedIndex].label}</span>
        <span
          aria-hidden="true"
          className={`h-3 w-px bg-current transition-transform duration-300 ${isOpen ? "rotate-[135deg]" : "rotate-45"}`}
        />
      </button>

      <ul
        id={`${id}-list`}
        role="listbox"
        aria-labelledby={`${id}-label`}
        className={`dropdown-list absolute end-0 top-full z-30 mt-1 min-w-full border border-paper bg-ink ${
          isOpen ? "is-open" : ""
        }`}
      >
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={isSelected}
              onPointerEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
              className={`label flex h-11 cursor-pointer items-center gap-3 whitespace-nowrap border-b border-line px-3 transition-colors last:border-b-0 ${
                index === activeIndex ? "bg-paper text-ink" : isSelected ? "text-paper" : "text-paper/60"
              }`}
            >
              <LogoMark className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "" : "invisible"}`} />
              {option.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
