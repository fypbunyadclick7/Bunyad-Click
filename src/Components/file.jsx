import React, { useState } from 'react';

const FileInputWithCustomStyle = () => {
  const [additionalScreenshot, setAdditionalScreenshot] = useState(null);

  const handleFileChange = (setter) => (event) => {
    const file = event.target.files[0];
    setter(file);
  };

  return (
    <div className="flex flex-col space-y-4 p-6">
      <div>
        <label htmlFor="reviewerName" className="block text-sm font-medium leading-6 text-gray-900">
          Reviewer Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="reviewerName"
            className="form-control custom-input"
            placeholder="Reviewer Name"
            required
          />
        </div>
      </div>

      <div className="mb-2">
        <label htmlFor="additionalScreenshot" style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
          Additional Screenshot
        </label>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <input
            type="file"
            id="additionalScreenshot"
            style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            onChange={handleFileChange(setAdditionalScreenshot)}
            required
          />
          <button
            type="button"
            style={{
              backgroundColor: '#f9f9f9',
              color: '#000',
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => document.getElementById('additionalScreenshot').click()}
          >
            <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
            {additionalScreenshot ? additionalScreenshot.name : 'Choose File'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-input {
          background-color: #f9f9f9;
          text-align: left;
          color: #333;
          padding: 12px 15px;
          border-radius: 10px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          width: 100%;
        }

        .custom-input:focus {
          outline: none;
          border-color: #386bc0;
          box-shadow: 0 0 5px rgba(56, 107, 192, 0.5);
          background-color: #fff;
        }
      `}</style>
    </div>
  );
};

export default FileInputWithCustomStyle;
