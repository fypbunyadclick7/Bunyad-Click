import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import {
    MDBCard,
    MDBCardBody,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBBtn
} from 'mdb-react-ui-kit';
import Spinner from '../spinner'; // Import your custom Spinner component

export default function TitleDescription() {
    const [optSmModal, setOptSmModal] = useState(false);
    const [isTitleModal, setIsTitleModal] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/getProfile/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': process.env.REACT_APP_API_KEY
                    }
                });

                setProfileData(response.data);
                setTitle(response.data.Profile?.Title || ''); // Set initial title
                setDescription(response.data.Profile?.Description || ''); // Set initial description
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Failed to fetch user profile.');
            }
        };

        fetchUserProfile();
    }, [userId]);

    const titleToggleOpen = () => {
        setOptSmModal(true);
        setIsTitleModal(true);
    };

    const descriptionToggleOpen = () => {
        setOptSmModal(true);
        setIsTitleModal(false);
    };

    const handleCloseModal = () => setOptSmModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        const updatedData = {
            Title: isTitleModal ? title : undefined,
            Description: !isTitleModal ? description : undefined
        };

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/user/updateProfile/${userId}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_API_KEY
                }
            });

            toast.success(`${isTitleModal ? 'Title' : 'Description'} updated successfully!`);
            handleCloseModal();

            // Optionally refetch the updated profile
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/getProfile//${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_API_KEY
                }
            });
            setProfileData(response.data);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(`Failed to update ${isTitleModal ? 'title' : 'description'}.`);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                        <h3 className="mb-1 mt-4">{profileData?.Profile?.Title || 'Web Developer'}</h3>
                        <i className="fas fa-edit ms-2 mt-4" style={{ color: 'var(--primary-btn-color)' }} onClick={titleToggleOpen}></i>
                    </div>
                    <div className="d-flex justify-content-center align-items-start">
                        <p className="text-muted mb-2 text-justify" style={{ textAlign: 'justify' }}>
                            {profileData?.Profile?.Description || 'I am a Web Developer with experience in building responsive websites and web applications.'}
                        </p>
                        <i className="fas fa-edit ms-2 mt-1" style={{ color: 'var(--primary-btn-color)' }} onClick={descriptionToggleOpen}></i>
                    </div>
                </MDBCardBody>
            </MDBCard>

            <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
                <MDBModalDialog size="xl">
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>{isTitleModal ? 'Update Title' : 'Update Description'}</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={handleCloseModal}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <form onSubmit={handleSubmit}>
                                {isTitleModal ? (
                                    <div className="mt-2">
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            placeholder="Enter Title"
                                            className="custom-input block w-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-0">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows="6"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            placeholder="Enter Description"
                                            className="custom-input block w-full"
                                        />
                                    </div>
                                )}
                                <div className="mt-3 text-center">
                                    <button
                                        type="submit"
                                        className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Spinner /> // Use your custom Spinner component here
                                        ) : (
                                            isTitleModal ? 'Update Title' : 'Update Description'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    );
}
