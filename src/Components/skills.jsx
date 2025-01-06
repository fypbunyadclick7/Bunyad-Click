import React, { useState, useRef } from 'react';

const SkillsInput = ({ onChange, skills = [] }) => {  // Default value for skills
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('Add Skills');

  const inputRef = useRef(null);

  const addSkill = (e) => {
    e.preventDefault();
    const skillToAdd = inputValue.trim().toUpperCase();

    if (skillToAdd && skills.length < 15) {
      if (!skills.includes(skillToAdd)) {
        const updatedSkills = [...skills, skillToAdd];
        onChange(updatedSkills); // Notify parent of the new skills array
        setInputValue('');
      }
      setInputFocused(true);
    }
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    onChange(newSkills); // Notify parent of the updated skills array
    inputRef.current.focus();
  };

  const handlePlaceholderClick = () => {
    setInputFocused(true);
    inputRef.current.focus();
  };

  return (
    <div>
      <div className="custom-input block w-full" style={styles.skillsContainer}>
        {skills.length > 0 && skills.map((skill, index) => (  // Ensure skills exists
          <div key={index} style={styles.tag}>
            {skill}
            <button
              type="button"
              style={styles.closeButton}
              onClick={() => removeSkill(index)}
            >
              &times;
            </button>
          </div>
        ))}
        {skills.length === 0 && !isInputFocused ? (
          <div onClick={handlePlaceholderClick} style={styles.placeholder}>
            {placeholderText}
          </div>
        ) : null}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill(e)}
          style={styles.input}
          onBlur={() => {
            setInputFocused(false);
          }}
          placeholder={placeholderText}
        />
      </div>
      <p>Maximum 15 skills.</p>
    </div>
  );
};

const styles = {
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    border: `1px solid var(--border-color)`,
    padding: '10px',
    borderRadius: '10px',
    minHeight: '40px',
    backgroundColor: 'var(--background-color)',
  },
  tag: {
    backgroundColor: 'var(--primary-btn-color)',
    borderRadius: '20px',
    padding: '5px 10px',
    margin: '5px',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--avatar-text-color)',
  },
  input: {
    border: 'none',
    outline: 'none',
    flex: '1',
    marginLeft: '10px',
    borderBottom: `1px solid var(--border-color)`,
    boxShadow: 'none',
  },
  placeholder: {
    color: 'var(--secondary-text-color)',
    margin: '5px',
    cursor: 'pointer',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    marginLeft: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '1',
    color: 'inherit',
  },
};

export default SkillsInput;
