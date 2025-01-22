const Input = ({
  type,
  name,
  id,
  value,
  placeholder,
  onChange,
  className,
  disabled,
  required,
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
    />
  );
};

const TextArea = ({
  rows,
  cols,
  name,
  id,
  value,
  onChange,
  className,
  disabled,
  required,
}) => {
  return (
    <textarea
      name={name}
      id={id}
      rows={rows}
      cols={cols}
      value={value}
      onChange={onChange}
      className={className}
      disabled={disabled}
      required={required}
    />
  );
};


export {Input, TextArea}