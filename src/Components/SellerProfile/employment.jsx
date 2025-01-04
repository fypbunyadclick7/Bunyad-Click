import React, { useState, useEffect } from 'react';
import {
  MDBRow,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn
} from 'mdb-react-ui-kit';
import { CountrySelect } from 'react-country-state-city';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import Spinner from '../spinner';

export default function ProfileSkills() {
  const [employmentHistories, setEmploymentHistories] = useState([]);
  const [selectedEmployment, setSelectedEmployment] = useState(null); // State for selected employment
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [optSmModal, setOptSmModal] = useState(false);
  const [optSmModal1, setOptSmModal1] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();
  const [countryid, setCountryid] = useState(0);
  const userId = Cookies.get('userId');
  const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => 1960 + i);
  const toggleOpen1 = () => setOptSmModal1(!optSmModal1);
  const [expandedState, setExpandedState] = useState({});

  // Toggle the expanded/collapsed state of the description
  const handleExpand = (id) => {
    setExpandedState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleCountryChange = (e) => setCountryid({ name: e.name, id: e.id });

  
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/getProfile/${userId}`, {
          headers: { 'api-key': process.env.REACT_APP_API_KEY,'Content-Type': 'application/json' },
        });
        setEmploymentHistories(response.data.EmploymentHistories || []);
      } catch (error) {
        toast.error('Failed to load employment history.');
      }
    };
  
    useEffect(() => {
      fetchProfile();
    }, [userId]);

  // Handle opening the edit modal with pre-filled data


  const resetFormFields = () => {
    setCompany('');
    setJobTitle('');
    setCity('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setCountryid(0);
  };
  
  // Modify toggleOpen function to reset fields for adding employment
  const toggleOpen = () => {
    resetFormFields(); // Reset fields when opening the add modal
    setOptSmModal(!optSmModal);
  };
  const handleDeleteEmployment = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this employment history?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/user/deleteEmploymentHistory/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      toast.success('Employment history deleted successfully!');
      setEmploymentHistories((prev) => prev.filter((history) => history.Id !== id));
      fetchProfile();
    } catch (error) {
      console.error('Error deleting employment history:', error);
      toast.error('Failed to delete employment history.');
    }
  };
  
  // Update the handleEditClick function to correctly set countryid and city
  const handleEditClick = (history) => {
    setSelectedEmployment(history); // Store selected employment
    setCompany(history.Company);
    setJobTitle(history.Title);
    setCity(history.City);
    setStartDate(new Date(history.StartDate).getFullYear());
    setEndDate(history.EndDate ? new Date(history.EndDate).getFullYear() : '');
    setDescription(history.Description);
    setCountryid({ name: history.Country, id: history.CountryId }); // Make sure to set country
    toggleOpen1(); // Open modal
  };

  // Handle employment update submission
  const handleUpdateEmployment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      title: jobTitle,
      company,
      country: countryid.name,
      city,
      startDate,
      endDate,
      description,
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/user/updateEmploymentHistory/${selectedEmployment.Id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        }
      );
      toast.success('Employment history updated successfully!');
      // Update the list with the updated history
      setEmploymentHistories((prev) =>
        prev.map((history) =>
          history.Id === selectedEmployment.Id ? response.data.employmentHistory : history
        )
      );
      toggleOpen1(); // Close the modal
    } catch (error) {
      toast.error('Failed to update employment history.');
    } finally {
      fetchProfile();
      setIsSubmitting(false);
    }
  };
  const handleAddEmployment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Show spinner

    // Validation: check if any required field is empty
    if (!jobTitle || !company || !countryid || !city || !startDate || !endDate || !description) {
        toast.error('Please fill in all required fields.');
        setIsSubmitting(false); // Hide spinner if validation fails
        return;
    }

    // Form data to send
    const formData = {
        title: jobTitle,
        company,
        country: countryid.name,
        city,
        startDate,
        endDate,
        description,
    };

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/v1/user/addEmploymentHistory/${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_API_KEY, // Using environment variable
                },
            }
        );
        toast.success('Employment history added successfully!');

        // Reset form fields after successful submission
        setCompany('');
        setJobTitle('');
        setStartDate('');
        setEndDate('');
        setDescription('');
        setCountryid(0);
        setCity('');
        
        toggleOpen(); 
    } catch (error) {
        console.error('Error adding employment history:', error);
        toast.error('Failed to add employment history.');
    } finally {
      fetchProfile();
        setIsSubmitting(false); 
    }
};

  return (
    <div>
    <MDBRow>
      <div className="container">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Employment History</h4>
          <i
              className="fa fa-plus-circle"
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                color: 'var(--primary-btn-color)',
                paddingBottom: '10px',
              }}
              onClick={toggleOpen}
            ></i>
        </div>

        {/* Render Employment History */}
        {employmentHistories.map((history) => (
          <div key={history.Id}>
            <div className="d-flex justify-content-between align-items-center mt-0">
              <h5>
                {history.Title} | <span>{history.Company}</span>
              </h5>
              <div className="d-flex">
                <i
                  className="fa fa-edit"
                  style={{
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: 'var(--primary-btn-color)',
                    paddingBottom: '10px',
                  }}
                  onClick={() => handleEditClick(history)}
                ></i>
                  <i
                    className="fa fa-trash"
                    style={{
                      cursor: 'pointer',
                      fontSize: '20px',
                      color: 'var(--primary-btn-color)',
                      paddingBottom: '10px',
                      marginLeft: '15px',
                    }}
                    onClick={() => handleDeleteEmployment(history.Id)} 
                  ></i>
              </div>
            </div>
            <h6 style={{ color: 'var(--secondary-text-color)' }}>
              {new Date(history.StartDate).toLocaleDateString()} -{' '}
              {history.EndDate ? new Date(history.EndDate).toLocaleDateString() : 'Present'}
            </h6>
            <p style={{ color: 'var(--secondary-text-color)', textAlign: 'justify' }}>
              {history.Description.split('. ').slice(0, 2).join('. ')}
              {!expandedState[history.Id] && '.'}
              {expandedState[history.Id] && history.Description.split('. ').slice(2).join('. ')}
              {!expandedState[history.Id] ? (
                <span
                  onClick={() => handleExpand(history.Id)}
                  style={{ color: 'var(--primary-btn-color)', cursor: 'pointer' }}
                >
                  {' '}
                  More
                </span>
              ) : (
                <span
                  onClick={() => handleExpand(history.Id)}
                  style={{ color: 'var(--primary-btn-color)', cursor: 'pointer' }}
                >
                  {' '}
                  Less
                </span>
              )}
            </p>
            <hr />
          </div>
        ))}
      </div>
      </div>
    </MDBRow>
    <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
          <MDBModalDialog size="xl">
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Add Employment History</MDBModalTitle>
                <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <form onSubmit={handleAddEmployment}>
                  <div className="container">
                    <div className="row">
                      <div>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          className="custom-input block w-full"
                          placeholder="Enter Company name"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6 mt-2">
                        <CountrySelect
                          id="country"
                          onChange={handleCountryChange}
                          placeHolder="Select Country"
                          className="custom-input block w-full"
                          required
                        />
                      </div>
                      <div className="col-md-6 mt-2">
                        <input
                          id="city"
                          name="city"
                          type="text"
                          required
                          className="custom-input block w-full"
                          placeholder="Enter City"
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <div className="mt-2">
                        <input
                          id="jobTitle"
                          name="jobTitle"
                          type="text"
                          required
                          className="custom-input block w-full"
                          placeholder="Enter job title"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <select
                          id="sYear"
                          className="bg-gray-50 border text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        >
                          <option value="" disabled>Choose Start Date</option>
                          {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <select
                          id="lYear"
                          className="bg-gray-50 border text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        >
                          <option value="" disabled>Choose End Date</option>
                          {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-2">
                        <textarea
                          id="description"
                          name="description"
                          rows="4"
                          required
                          placeholder="Enter Description"
                          className="custom-input block w-full"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <button
                        type="submit"
                        className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Spinner /> : 'Add Employment'}
                      </button>
                    </div>
                  </div>
                </form>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>

        <MDBModal show={optSmModal1} setShow={setOptSmModal1} tabIndex="-1">
    <MDBModalDialog size="xl">
        <MDBModalContent>
            <MDBModalHeader>
                <MDBModalTitle>Update Employment History</MDBModalTitle>
                <MDBBtn className="btn-close" color="none" onClick={toggleOpen1}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <form onSubmit={handleUpdateEmployment}>
                    <div className="container">
                        <div className="row">
                            <div>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    required
                                    className="custom-input block w-full"
                                    placeholder="Enter Company name"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mt-2">
                                <CountrySelect
                                    id="country"
                                    onChange={handleCountryChange}
                                    placeHolder="Select Country"
                                    className="custom-input block w-full"
                                    required
                                    value={countryid.name} // Prefill country
                                />
                            </div>
                            <div className="col-md-6 mt-2">
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    className="custom-input block w-full"
                                    placeholder="Enter City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                            <div className="mt-2">
                                <input
                                    id="jobTitle"
                                    name="jobTitle"
                                    type="text"
                                    required
                                    className="custom-input block w-full"
                                    placeholder="Enter Job Title"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <select
                                    id="sYear"
                                    className="bg-gray-50 border text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Choose Start Date</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <select
                                    id="lYear"
                                    className="bg-gray-50 border text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                >
                                    <option value="" disabled>Choose End Date</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    required
                                    placeholder="Enter Description"
                                    className="custom-input block w-full"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <button
                                type="submit"
                                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Spinner /> : 'Update Employment'}
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
