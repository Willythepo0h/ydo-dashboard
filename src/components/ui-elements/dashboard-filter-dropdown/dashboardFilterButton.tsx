import { useState, useMemo, useRef, useEffect } from "react";
import './dashboardFilterButton.css'

type SingleSelectProps = {
  multiSelect?: false;
  value: string | null;
  onChange: (value: string | null) => void;
};

type MultiSelectProps = {
  multiSelect: true;
  value: string[] | null;
  onChange: (value: string[] | null) => void;
};

interface BaseProps {
  label?: string;
  placeholder: string;
  options: string[];
  searchable?: boolean;
  searchPlaceholder?: string;
}

type FilterDropdownProps = BaseProps & (SingleSelectProps | MultiSelectProps);

export function FilterDropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  searchable = false,
  searchPlaceholder = "Search...",
  multiSelect,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isMultiSelect = multiSelect === true;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm, searchable]);

  // Helper: check if option is selected
  const isSelected = (option: string) => {
    if (isMultiSelect && Array.isArray(value)) {
      return value.includes(option);
    }
    return value === option;
  };

  // Handle selecting an option
  const handleSelect = (option: string) => {
    if (isMultiSelect) {
      const current = Array.isArray(value) ? value : [];
      let next: string[];

      if (option === "") {
        next = [];
      } else if (current.includes(option)) {
        next = current.filter((v) => v !== option);
      } else {
        next = [...current, option];
      }

      onChange(next.length ? next : null);
    } else {
      onChange(option === "" ? null : option);
      setOpen(false);
    }

    setSearchTerm("");
  };

  const displayValue = useMemo(() => {
    if (isMultiSelect && Array.isArray(value)) {
      return value.length ? value.join(", ") : placeholder;
    }
    return value || placeholder;
  }, [value, isMultiSelect, placeholder]);

  return (
    <div className="filter-dropdown" ref={containerRef}>
      {label && <label className="filter-label">{label}</label>}

      {/* Dropdown button */}
      <button
        type="button"
        className="filter-dropdown-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {displayValue}
        <span className="filter-dropdown-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="filter-dropdown-panel">
          {/* Search input inside panel */}
          {searchable && (
            <input
              type="text"
              className="filter-dropdown-search"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}

          {/* Options list */}
          <ul className="filter-dropdown-list">
            {/* Placeholder option */}
            {(!multiSelect || !value?.length) && (
              <li
                className="filter-dropdown-item"
                onClick={() => handleSelect("")}
              >
                {placeholder}
              </li>
            )}

            {/* Render filtered options */}
            {filteredOptions.map((opt) => (
              <li
                key={opt}
                className="filter-dropdown-item"
                onClick={() => handleSelect(opt)}
              >
                {isMultiSelect ? (
                  <div className="filter-dropdown-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={isSelected(opt)}
                      readOnly
                      className="filter-dropdown-checkbox"
                    />
                    <span className="filter-dropdown-item-label">{opt}</span>
                  </div>
                ) : (
                  opt
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
