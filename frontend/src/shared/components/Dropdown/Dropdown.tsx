import type { DropdownProps } from "./dropdown.types";

const Dropdown = ({
  label,
  name,
  value,
  options,
  placeholder = "Choisir une option",
  onChange,
}: DropdownProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-zinc-200">
          {label}
        </label>
      )}

      {/* Même style que les filtres des bibliothèques. */}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
