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
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';
import Spinner from '../spinner';

export default function ProfileSkills() {
  const [optSmModal1, setOptSmModal1] = useState(false);
  const [optSmModal, setOptSmModal] = useState(false);
  const toggleOpen1 = () => setOptSmModal1(!optSmModal1);
  const [educationData, setEducationData] = useState([]);
      const [expandedEntries, setExpandedEntries] = useState({}); // Object to track which item is expanded
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    school: '',
    sYear: '',
    lYear: '',
    degName: '',
    description: ''
  });
  const [formData, setFormData] = useState({
    school: '',
    sYear: '',
    lYear: '',
    degName: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const userId = Cookies.get('userId'); // Assuming the userId is stored in cookies

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => 1960 + i); // Generate years from 1960 to current year

  const handleExpand = (eduId) => {
    setExpandedEntries((prevState) => ({
      ...prevState,
      [eduId]: !prevState[eduId], // Toggle the specific education entry
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userId) {
      toast.error('User ID not found!');
      setIsLoading(false);
      return;
    }

    const { school, sYear, lYear, degName, description } = formData;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/addEducation/${userId}`,
        {
          title: degName,
          description: description,
          startDate: `${sYear}-01-01`,
          endDate: `${lYear}-01-01`,
          schoolName: school
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,

          }
        }
      );

      if (response.status === 201) {
        toast.success('Education added successfully!');
        fetchProfile();
        setOptSmModal(false);
      }
    } catch (error) {
      console.error('Error adding education:', error);
      toast.error('Failed to add education.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fetch education data
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/getProfile/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );
      const { Education } = response.data;
      setEducationData(Education);
    } catch (error) {
      toast.error('Failed to fetch education details.');
      console.error('Error fetching education data:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleEditClick = (edu) => {
    setEditId(edu.Id);  // Set the education ID to be edited
    setEditFormData({
      school: edu.SchoolName,
      sYear: new Date(edu.StartDate).getFullYear(),
      lYear: new Date(edu.EndDate).getFullYear(),
      degName: edu.Title,
      description: edu.Description
    });
    
    setOptSmModal1(true);  // Open the modal
  };
  
  const [isOpen, setIsOpen] = useState(false);


const toggleOpen = () => setOptSmModal(!optSmModal);


  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { school, sYear, lYear, degName, description } = editFormData;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/user/updateEducation/${editId}`,
        {
          title: degName,
          description,
          startDate: `${sYear}-01-01`,
          endDate: `${lYear}-01-01`,
          schoolName: school
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        }
      );

      if (response.status === 200) {
        toast.success('Education updated successfully!');
        setOptSmModal1(false);
        fetchProfile(); // Fetch updated data
      }
    } catch (error) {
      console.error('Error updating education:', error);
      toast.error('Failed to update education.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteClick = async (eduId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this education record?");
    
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/v1/user/deleteEducation/${eduId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'api-key': process.env.REACT_APP_API_KEY
            }
          }
        );
  
        if (response.status === 200) {
          toast.success('Education deleted successfully.');
          fetchProfile(); // Refresh the list after deletion
        }
      } catch (error) {
        console.error('Error deleting education:', error);
        toast.error('Failed to delete education.');
      }
    }
  };
  

  const confirmDelete = async (t, eduId) => {
    toast.dismiss(t.id); // Close the toast when confirmed
    console.log("Confirming delete for ID:", eduId); // Debug log
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_API_URL}/api/v1/user/deleteEducation/${eduId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_API_KEY
                }
            }
        );
        console.log("Delete response:", response); // Debug log
        if (response.status === 200) {
            toast.success('Education deleted successfully.');
            fetchProfile(); // Refresh the list after deletion
        }
    } catch (error) {
        console.error('Error deleting education:', error);
        toast.error('Failed to delete education.');
    }
};


  return (
    <div>
     <MDBRow>
      <div className='container'>
      <div className='container'>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Education</h4>

        <i
          className="fa fa-plus-circle"
          style={{ cursor: 'pointer', fontSize: '20px', color: 'var(--primary-btn-color)' ,paddingBottom:'10px'}}
onClick={toggleOpen} 
        ></i>
      </div>

      {educationData.length > 0 ? (
              educationData.map((edu) => (
                <><div key={edu.Id} className="d-flex justify-content-between align-items-center mt-0">
                  <h5>{edu.SchoolName} <span style={{ fontSize: '16px', color: 'var(--secondary-text-color)' }}>({new Date(edu.StartDate).getFullYear()} - {new Date(edu.EndDate).getFullYear()})</span></h5>
                  <div className="d-flex" style={{ marginTop: '-20px' }}>
                  <i
  className="fa fa-edit"
  style={{
    cursor: 'pointer',
    fontSize: '20px',
    color: 'var(--primary-btn-color)',
    paddingBottom: '10px'
  }}
  onClick={() => handleEditClick(edu)}  
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
  onClick={() => handleDeleteClick(edu.Id)} // Directly call the function
></i>

                  </div>

                </div>
                <h6>{edu.Title}</h6>
                <p style={{ color: 'var(--secondary-text-color)', textAlign: 'justify' }}>
                    {/* Split description into sentences */}
                    {edu.Description.split('. ').slice(0, 2).join('. ')}{!expandedEntries[edu.Id] && '.'}
                    
                    {expandedEntries[edu.Id] && edu.Description.split('. ').slice(2).join('. ')}

                    {/* Toggle "More" or "Less" based on expanded state */}
                    {!expandedEntries[edu.Id] && (
                      <span
                        onClick={() => handleExpand(edu.Id)}
                        style={{ color: 'var(--primary-btn-color)', cursor: 'pointer' }}
                      >
                        {' '}More
                      </span>
                    )}
                    {expandedEntries[edu.Id] && (
                      <span
                        onClick={() => handleExpand(edu.Id)}
                        style={{ color: 'var(--primary-btn-color)', cursor: 'pointer' }}
                      >
                        {' '}Less
                      </span>
                    )}
                  </p>
                  </>
                ))
              ) : (
                <p>No education records found.</p>
              )}
        </div>




</div>

        
      </MDBRow>

      <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
        <MDBModalDialog size="xl">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add Education</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={handleSubmit}>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <input
                        id="school"
                        name="school"
                        type="text"
                        value={formData.school}
                        onChange={handleInputChange}
                        required
                        className="custom-input block w-full"
                        placeholder="Enter your school"
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <select
                        id="sYear"
                        name="sYear"
                        value={formData.sYear}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                        required
                      >
                        <option value="" selected>
                          Choose Start Date
                        </option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mt-2">
                      <select
                        id="lYear"
                        name="lYear"
                        value={formData.lYear}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                        required
                      >
                        <option value="" selected>
                          Choose End Date
                        </option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12 mt-2">
                      <input
                        id="degName"
                        name="degName"
                        type="text"
                        value={formData.degName}
                        onChange={handleInputChange}
                        required
                        className="custom-input block w-full"
                        placeholder="Enter degree name"
                      />
                    </div>
                    <div className="col-md-12 mt-2">
                      <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Description"
                        className="custom-input block w-full"
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <button
                      type="submit"
                      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isLoading ? <Spinner /> : 'Add Education'}
                    </button>
                  </div>
                </div>
              </form>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Modal for Updating Education */}
      <MDBModal show={optSmModal1} setShow={setOptSmModal1} tabIndex="-1">
        <MDBModalDialog size="xl">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Education</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen1}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={handleUpdate}>
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <input
                        id="school"
                        name="school"
                        type="text"
                        required
                        className="custom-input block w-full"
                        placeholder="Enter your school"
                        value={editFormData.school}
                        onChange={(e) => setEditFormData({ ...editFormData, school: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mt-2">
                      <select
                        id="sYear"
                        name="sYear"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                        value={editFormData.sYear}
                        onChange={(e) => setEditFormData({ ...editFormData, sYear: e.target.value })}
                      >
                        <option value="">Choose Start Date</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mt-2">
                      <select
                        id="lYear"
                        name="lYear"
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 mt-2"
                        value={editFormData.lYear}
                        onChange={(e) => setEditFormData({ ...editFormData, lYear: e.target.value })}
                      >
                        <option value="">Choose End Date</option>
                        {years.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12 mt-2">
                      <input
                        id="degName"
                        name="degName"
                        type="text"
                        required
                        className="custom-input block w-full"
                        placeholder="Enter degree name"
                        value={editFormData.degName}
                        onChange={(e) => setEditFormData({ ...editFormData, degName: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12 mt-2">
                      <textarea
                        id="description"
                        name="description"
                        rows="4"
                        required
                        placeholder="Enter Description"
                        className="custom-input block w-full"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <button
                      type="submit"
                 className="flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"              >
                {isLoading ? <Spinner /> : 'Update Education'}
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

