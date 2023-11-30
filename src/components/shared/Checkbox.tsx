import { ChangeEventHandler } from "react";

export const Checkbox = ({
  label,
  name,
  onChange,
  checked
}: {
  name: string,
  checked?: boolean;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        onChange={onChange}
        id={name}
        type="checkbox"
        value=""
        checked={checked}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={name}
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
    </div>
  );
};
