// LoadingSpinner.jsx
export const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  };
  
  // ErrorMessage.jsx
  export const ErrorMessage = ({ message }) => {
    return (
      <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
        <p>{message}</p>
      </div>
    );
  };
  
  // SuccessMessage.jsx
  export const SuccessMessage = ({ message }) => {
    return (
      <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
        <p>{message}</p>
      </div>
    );
  };
  
  // FormField.jsx
  export const FormField = ({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    options = [],
    min,
    max
  }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        
        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
          />
        )}
        
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };
  
  // Card.jsx
  export const Card = ({ title, children }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        {title && <h3 className="text-lg font-medium mb-3">{title}</h3>}
        {children}
      </div>
    );
  };
  
  // Button.jsx
  export const Button = ({ 
    onClick, 
    disabled, 
    type = 'button', 
    fullWidth = false,
    variant = 'primary', 
    children 
  }) => {
    const baseClasses = "px-4 py-2 rounded font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100",
      outline: "bg-white text-red-600 border border-red-600 hover:bg-red-50 focus:ring-red-500 disabled:text-red-400"
    };
    
    const widthClass = fullWidth ? "w-full" : "";
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`}
      >
        {children}
      </button>
    );
  };