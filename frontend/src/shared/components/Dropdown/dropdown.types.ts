export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  label?: string;
  name: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  onChange: (value: string) => void;
};
