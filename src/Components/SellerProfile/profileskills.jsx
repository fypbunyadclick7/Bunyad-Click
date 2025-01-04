import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import Spinner from '../spinner';

// Utility function to capitalize skill titles
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default function ProfileSkills() {
  const [optSmModal, setOptSmModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillsInModal, setSkillsInModal] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const toggleOpen = () => setOptSmModal(!optSmModal);
  const userId = Cookies.get('userId');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/getProfile/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY
        },
      });
      setSkills(response.data.Skills || []);
      setSkillsInModal(response.data.Skills || []);
    } catch (error) {
      toast.error('Failed to load profile skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleSkillRemove = async (skillId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/user/deleteSkill/${skillId}`, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY
        },
      });
      // Update local state
      setSkillsInModal(skillsInModal.filter(skill => skill.Id !== skillId));
      setSkills(skills.filter(skill => skill.Id !== skillId)); // Update main skills list
      toast.success('Skill deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete skill.');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (newSkill.trim() === '') return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/user/addSkill/${userId}`, {
        title: newSkill
      }, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY
        },
      });

      const addedSkill = { Id: response.data.skill.Id, Title: capitalize(newSkill) }; // Capitalize skill title

      // Update local state
      setSkillsInModal([...skillsInModal, addedSkill]);
      setSkills([...skills, addedSkill]); // Update main skills list
      setNewSkill('');
      toast.success('Skill added successfully.');
    } catch (error) {
      toast.error('Failed to add skill.');
    }
  };

  return (
    <div>
      <MDBRow>
        <div className='container'>
          <div className="d-flex justify-content-between align-items-center mt-2 px-3">
            <h4>Skills</h4>
            <i
              className="fa fa-edit"
              style={{ cursor: 'pointer', fontSize: '24px', color: 'var(--primary-btn-color)', paddingBottom: '10px' }}
              onClick={() => {
                toggleOpen();
                fetchProfile();
              }}
            ></i>
          </div>

          <div className="skills-container">
            {loading ? (
              <Spinner />
            ) : (
              skills.map((skill, index) => (
                <span key={index} className="skill-tag">{capitalize(skill.Title)}</span> // Capitalize skill title
              ))
            )}
          </div>
          <hr />
        </div>
      </MDBRow>

      <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
        <MDBModalDialog size="lg">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Update Skills</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={handleAddSkill} encType="multipart/form-data">
                <div className="container">
                  <div className="row mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add new skill"
                      className="form-control"
                      required
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSkill(e);
                        }
                      }}
                    />
                  </div>
                  <div className="skills-container mb-3">
                    {skillsInModal.map((skill) => (
                      <span key={skill.Id} className="skill-tag">
                        {capitalize(skill.Title)} {/* Capitalize skill title */}
                        <i
                          className="fa fa-times-circle"
                          style={{ cursor: 'pointer', marginLeft: '8px' }}
                          onClick={() => handleSkillRemove(skill.Id)}
                        ></i>
                      </span>
                    ))}
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
