import React, { useEffect, useState } from 'react';
import {
  MDBRow,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Spinner from '../spinner';

export default function ProfileSkills() {
  const [optSmModal, setOptSmModal] = useState(false);
  const toggleOpen = () => setOptSmModal(!optSmModal);
  const [optSmModal1, setOptSmModal1] = useState(false);
  const toggleOpen1 = () => setOptSmModal1(!optSmModal1);

  const [language, setLanguage] = useState('');
  const [languageLevel, setLanguageLevel] = useState('');
  const [languages, setLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userId = Cookies.get('userId');

  const languageLevels = {
    25: 'Basic',
    50: 'Conversational',
    75: 'Fluent',
    100: 'Native or Bilingual',
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/getProfile/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        });
        setLanguages(response.data.Languages);
      } catch (error) {
        toast.error('Error fetching languages');
      }
    };

    fetchLanguages();
  }, [userId]);

  const addLanguage = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error('User ID is not available.');
      return;
    }
    setIsAdding(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/addLanguage/${userId}`, {
        title: language,
        progress: languageLevel,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      toast.success(response.data.message);
      toggleOpen(); // Close modal after successful addition
      setLanguages((prev) => [...prev, { Title: language, Progress: languageLevel }]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding language');
    } finally {
      setIsAdding(false);
    }
  };

  const deleteLanguage = async (e) => {
    e.preventDefault();
    if (!userId || !language) {
      toast.error('User ID or language is not available.');
      return;
    }
  
    // Log the language value to the console
    console.log('Language to be deleted:', language);
  
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/user/deleteLanguage/${userId}`, {
        data: { title: language }, // Pass language title in request body
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      toast.success(response.data.message);
      toggleOpen1(); // Close modal after successful deletion
      setLanguages((prev) => prev.filter(lang => lang.Title !== language));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting language');
    } finally {
      setIsDeleting(false);
    }
  };
  
  

  return (
    <div>
      <MDBRow>
        <div className='container'>
          <div className="d-flex justify-content-between align-items-center mt-4 px-3">
            <h4>Languages</h4>
            <div className="d-flex">
              <i
                className="fa fa-plus-circle"
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: 'var(--primary-btn-color)',
                  paddingBottom: '10px'
                }}
                onClick={toggleOpen}
              ></i>
              <i
                className="fa fa-trash"
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: 'var(--primary-btn-color)',
                  paddingBottom: '10px',
                  marginLeft: '15px'
                }}
                onClick={toggleOpen1}
              ></i>
            </div>
          </div>
          <div className="d-flex flex-column px-3">
            {languages.map((lang, index) => (
              <p key={index} className="mb-1">
                {lang.Title}: <span style={{ color: 'var(--secondary-text-color)' }}>{languageLevels[lang.Progress] || 'Unknown'}</span>
              </p>
            ))}
          </div>
        </div>
      </MDBRow>

      {/* Add Language Modal */}
      <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1" >
        <MDBModalDialog size="lg" >
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add Languages</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={addLanguage}>
                <div className="container">
                  <div className="row">
                    <select 
                      id="language" 
                      className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="">Choose Language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Russian">Russian</option>
                      <option value="Urdu">Urdu</option>
                    </select>

                    <select
                      id="languageLevel"
                      className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 mt-2"
                      onChange={(e) => setLanguageLevel(e.target.value)}
                    >
                      <option value="">Choose Proficiency Level</option>
                      <option value="25">Basic</option>
                      <option value="50">Conversational</option>
                      <option value="75">Fluent</option>
                      <option value="100">Native or Bilingual</option>
                    </select>
                  </div>
                  <div className="mt-3 text-center">
                    <button 
                      type="submit" 
                      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isAdding ? <Spinner /> : 'Add Language'}
                    </button>
                  </div>
                </div>
              </form>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal show={optSmModal1} setShow={setOptSmModal1} tabIndex="-1">
        <MDBModalDialog size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Delete Languages</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen1}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={deleteLanguage}>
                <div className="container">
                  <div className="row">
                    <select 
                      id="language" 
                      className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="">Choose Language</option>
                      {languages.map((lang, index) => (
                        <option key={index} value={lang.Title}>{lang.Title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 text-center">
                    <button 
                      type="submit" 
                      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isDeleting ? <Spinner /> : 'Delete Language'}
                    </button>
                  </div>
                </div>
              </form>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
