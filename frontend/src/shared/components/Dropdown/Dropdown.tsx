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
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md bg-zinc-950 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
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
