export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  as = "input",
  rows = 4,
  options = [],
  placeholder,
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      ) : as === "select" ? (
        <select name={name} value={value} onChange={onChange} required={required}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
