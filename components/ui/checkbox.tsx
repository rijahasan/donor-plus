// components/ui/Checkbox.tsx

import { useState } from "react";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked); // Pass the updated checked state to the parent
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={label}
        checked={isChecked}
        onChange={handleChange}
        className="form-checkbox h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-600"
      />
      <label htmlFor={label} className="text-sm">{label}</label>
    </div>
  );
};
