import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const CustomCombobox = ({ options, selectedCategory, onChange, placeholder }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Set inputValue to the label of the selectedCategory if it's provided
    if (selectedCategory) {
      const selectedOption = options.find(option => option.value === selectedCategory);
      setInputValue(selectedOption ? selectedOption.label : '');
    }
  }, [selectedCategory, options]); // Re-run if selectedCategory or options change

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setDropdownOpen(true); // Show dropdown when typing
  };

  const handleOptionClick = (option) => {
    setInputValue(option.label); // Set input to selected label
    onChange(option.value); // Notify parent of the selection
    setDropdownOpen(false); // Close dropdown after selection
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  // Attach event listener for clicks outside
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="custom-combobox" style={styles.container}>
      <input
        type="text"
        className="custom-input1 block w-full"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setDropdownOpen(true)} // Show dropdown on focus
        placeholder={placeholder}
        style={styles.input}
        readOnly
      />
      <span style={styles.arrow} onClick={() => setDropdownOpen(!isDropdownOpen)}>
        <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: "14px" }} />
      </span>
      {isDropdownOpen && (
        <div className="dropdown" ref={dropdownRef}>
          {options
            // .filter((option) =>
            //   option.label.toLowerCase().includes(inputValue.toLowerCase()) // Filter options based on input
            // )
            .map((option) => (
              <div
                key={option.value}
                className="option"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
  },
  input: {
    paddingRight: '30px', // Add padding to make space for the arrow
  },
  arrow: {
    position: 'absolute',
    right: '15px', // Adjust position as needed
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    pointerEvents: 'none', // Prevent pointer events on the arrow itself
    color: 'var(--text-color)', // Color of the arrow
  },
};

export default CustomCombobox;
