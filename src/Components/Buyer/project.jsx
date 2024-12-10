import React, { useState } from 'react';

export default function Project() {
    const [showMore, setShowMore] = useState(false);
    const description = `
        BunyadClick is an innovative e-commerce platform designed specifically for the construction industry. 
        This project aims to streamline the procurement process, enhance project management, and improve cost estimation accuracy for 
        contractors, suppliers, and clients. The platform serves as a comprehensive marketplace where stakeholders can connect, collaborate, and efficiently manage their construction projects.
     BunyadClick is an innovative e-commerce platform designed specifically for the construction industry. 
        This project aims to streamline the procurement process, enhance project management, and improve cost estimation accuracy for 
        contractors, suppliers, and clients. The platform serves as a comprehensive marketplace where stakeholders can connect, collaborate, and efficiently manage their construction projects.
        `;
    const initialCharacterLimit = 400;
  return (
    <div>
       <div>
              <div className="d-flex justify-content-between align-items-center mt-0">
                <div className="d-flex align-items-center">
                  <h5 style={{ marginRight: '10px' }}>Mobile App Developer</h5>
                </div>
                <div>
                  <span style={{ color: 'var(--secondary-text-color)', fontWeight: 'bold' }}>Created 3 months ago by you</span>
                </div>
              </div>
              <div style={{ width: '100%', textAlign: 'justify' }}>
                <p style={{ fontSize: '14px', color: 'var(--secondary-text-color)', marginBottom: '0' }}>
                  {showMore ? description : `${description.slice(0, initialCharacterLimit)}...`}
                </p>
                {description.length > initialCharacterLimit && (
                  <button
                    onClick={() => setShowMore(prev => !prev)}
                    style={{ background: 'none', color: 'blue', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                  >
                    {showMore ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
              <hr />
            </div>
    </div>
  )
}
