interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export default function FormInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
}: FormInputProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className={`input w-full border-2 rounded-lg outline-none transition-colors ${
          error
            ? "border-error focus:border-error"
            : "border-base-300 focus:border-primary"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="text-error text-xs mt-1">{error}</span>}
    </div>
  );
}
