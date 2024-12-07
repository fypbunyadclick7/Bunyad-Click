import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBBtn
} from 'mdb-react-ui-kit';


import {
    CitySelect,
    CountrySelect,
    StateSelect,
} from 'react-country-state-city';
import SellerNavbar from '../../Components/sellerNavbar';
import StarRating from '../../Components/BuyerProfile/starRating';


import TitlteDescription from '../../Components/SellerProfile/titleDescription';
import Portfolio from '../../Components/SellerProfile/portfolio';
import Skills from '../../Components/SellerProfile/profileskills';
import Languages from '../../Components/SellerProfile/language';
import Education from '../../Components/SellerProfile/education';
import Employment from '../../Components/SellerProfile/employment';
import ReviewCard from '../../Components/SellerProfile/review';
import { uploadToCloudinary } from '../../utils/cloudinaryService'; // Import Cloudinary utility function
import toast, { Toaster } from 'react-hot-toast';
import Spinner from '../../Components/spinner';


export default function ProfilePage() {
    const [optSmModal, setOptSmModal] = useState(false);
    const toggleOpen = () => setOptSmModal(!optSmModal);
    const [countryid, setCountryid] = useState(0);
    const [stateid, setStateid] = useState(0);
    const [cityid, setCityid] = useState(0);
    const [additionalScreenshot, setAdditionalScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [loading1, setLoading1] = useState(false);



    const [formData, setFormData] = useState({
        country: '',
        state: '',
        city: '',
    });

    const [modalProfile, setModalProfile] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        countryId: '',
        stateId: '',
        cityId: '',
    });
    const [profile, setProfile] = useState({
        name: '',
        role: '',
        email: '',
        phoneNumber: '',
        city: '',
        state: '',
        country: '',
        imageUrl: '',
    });

    const handleFileChange = (event) => {
        console.log(event.target)
        setAdditionalScreenshot(event.target.files[0]);
    };

    const handleCountryChange = (e) => {
        setCountryid({ name: e.name, id: e.id });
        setFormData({ ...formData, country: e.name });
    };

    const handleStateChange = (e) => {
        setStateid({ name: e.name, id: e.id });
        setFormData({ ...formData, state: e.name });
    };

    const handleCityChange = (e) => {
        setCityid({ name: e.name, id: e.id });
        setFormData({ ...formData, city: e.name });
    };

    const fetchProfileData = async () => {
        const userId = Cookies.get('userId');
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/getProfile/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_API_KEY
                }
            });
            const userData = response.data;
    
            setProfile({
                name: userData.Name || '',
                role: userData.Role || '',
                email: userData.Email || '',
                phoneNumber: userData.PhoneNumber || '',
                city: userData.City || '',
                state: userData.State || '',
                country: userData.Country || '',
                imageUrl: userData.Image || '',
            });
    
            // Set initial data for modal
            setModalProfile({
                name: userData.Name || '',
                email: userData.Email || '',
                phoneNumber: userData.PhoneNumber || '',
                countryId: userData.CountryId || '',
                stateId: userData.StateId || '',
                cityId: userData.CityId || '',
            });
    
            // Set the IDs for the select components
            setCountryid({ name: userData.Country || '', id: userData.CountryId || '' });
            setStateid({ name: userData.State || '', id: userData.StateId || '' });
            setCityid({ name: userData.City || '', id: userData.CityId || '' });
    
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchProfileData().then(() => setProfileLoading(false));
    }, []);
    if (profileLoading) {
        return <Spinner />; // or some loading indicator
    }

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        setLoading(true); // Start loading

        const userId = Cookies.get('userId');
        const form = new FormData();

        form.append('Name', modalProfile.name);
        form.append('Email', modalProfile.email);
        form.append('PhoneNumber', modalProfile.phoneNumber);
        form.append('Country', formData.country || modalProfile.country);
        form.append('State', formData.state || modalProfile.state);
        form.append('City', formData.city || modalProfile.city);
        try {
            // Upload image to Cloudinary if file selected
            if (additionalScreenshot) {
                const imageUrl = await uploadToCloudinary(additionalScreenshot);
                form.append('Image', imageUrl);
            }

            // Send updated data to the backend
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/v1/auth/updateUser/${userId}`,
                form,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': process.env.REACT_APP_API_KEY,
                    },
                }
            );

            setProfile(response.data.user); // Update profile state with new data
            toast.success("Profile updated successfully!"); // Success toast
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error("Error updating profile. Please try again."); // Error toast
        } finally {
            setLoading(false); // Stop loading
            setOptSmModal(false); // Close modal on success
            fetchProfileData();
        }
    };

    //   <div className="mt-3 text-center">
    //     <button
    //       type="submit"
    //       className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //       disabled={loading} 
    //     >
    //       {loading ? <Spinner /> : "Update Profile"}
    //     </button>
    //   </div>



    return (
        <section>
            <SellerNavbar />
            <Toaster />

            <MDBContainer className="py-1">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <center>    
                                <MDBCardImage
                                    src={profile?.imageUrl ? profile.imageUrl : ''}
                                    alt="avatar"
                                    className="rounded-circle"
                                    fluid
                                    style={{ width: '120px', height: '120px' }} 
                                />


                                </center>

                                <h5 className="text-muted mb-1 mt-4">{profile?.name}</h5>
                                <h6 className="text-muted mb-2">{profile?.role}</h6>
                                <StarRating rating={4.5} />
                                <center style={{ marginTop: '10px' }}>
                                    <div >
                                        <button
                                            type="submit"
                                            className="flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={toggleOpen}
                                        >
                                            Update Profile
                                        </button>
                                    </div>
                                </center>
                            </MDBCardBody>
                        </MDBCard>

                        <MDBCard className="mb-4 mb-lg-0">
                            <MDBCardBody className="p-0">
                                <MDBListGroup flush className="rounded-3">
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                            <MDBIcon fas icon="envelope" />
                                            <span>Email</span>
                                        </div>
                                        <MDBCardText>{profile?.email}</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                            <MDBIcon fas icon="phone-square-alt" />
                                            <span>Phone</span>
                                        </div>
                                        <MDBCardText>{profile?.phoneNumber}</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                            <MDBIcon fas icon="map-marker" />
                                            <span>City</span>
                                        </div>
                                        <MDBCardText>{profile?.city}</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                            <MDBIcon fas icon="map-marker-alt" />
                                            <span>State</span>
                                        </div>
                                        <MDBCardText>{profile?.state}</MDBCardText>
                                    </MDBListGroupItem>
                                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                                        <div className="d-flex align-items-center" style={{ gap: 10 }}>
                                            <MDBIcon fas icon="globe-asia" />
                                            <span>Country</span>
                                        </div>
                                        <MDBCardText>{profile?.country}</MDBCardText>
                                    </MDBListGroupItem>
                                </MDBListGroup>
                                <Languages />
                                <hr style={{ height: '1px', backgroundColor: 'black', border: 'none' }} />
                                <Education />
                                <hr style={{ height: '1px', backgroundColor: 'black', border: 'none' }} />
                                <Employment />
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                    <MDBCol lg="8">
                        <MDBContainer>
                            <TitlteDescription />
                            <Portfolio />


                        </MDBContainer>

                        <MDBContainer style={{ marginTop: '30px' }}>
                            <MDBCard>
                                <Skills />
                                <ReviewCard />
                            </MDBCard>
                        </MDBContainer>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
                <MDBModalDialog size="xl" centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Update Profile</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <form onSubmit={handleProfileUpdate}>
                                <div className="container">
                                    <div className="row">
                                        {/* Left Side */}
                                        <div className="col-md-6">
                                            {/* Name Field */}
                                            <div className="mt-2">
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    placeholder="Name"
                                                    className="custom-input block w-full"
                                                    value={modalProfile.name}
                                                    onChange={(e) => setModalProfile({ ...modalProfile, name: e.target.value })}
                                                />
                                            </div>

                                            {/* Email Field */}
                                            <div className="mt-2">
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    placeholder="Email address"
                                                    className="custom-input block w-full"
                                                    value={modalProfile.email}
                                                    onChange={(e) => setModalProfile({ ...modalProfile, email: e.target.value })}
                                                />
                                            </div>

                                            {/* Phone Number Field */}
                                            <div className="mt-2">
                                                <input
                                                    id="phoneNo"
                                                    name="phoneNo"
                                                    type="text"
                                                    required
                                                    placeholder="Phone Number"
                                                    className="custom-input block w-full"
                                                    value={modalProfile.phoneNumber}
                                                    onChange={(e) => setModalProfile({ ...modalProfile, phoneNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Side */}
                                        <div className="col-md-6">
                                            {/* Country Select */}
                                            <div style={{ marginTop: '8px' }}>
                                                <CountrySelect
                                                    id="country"
                                                    onChange={handleCountryChange}
                                                    placeHolder="Select Country"
                                                    className="custom-input block w-full"
                                                    required
                                                />
                                            </div>

                                            {/* State Select */}
                                            <div style={{ marginTop: '8px' }}>
                                                <StateSelect
                                                    id="state"
                                                    countryid={countryid.id}
                                                    onChange={handleStateChange}
                                                    placeHolder="Select State"
                                                    className="custom-input block w-full"
                                                    required
                                                />
                                            </div>

                                            {/* City Select */}
                                            <div style={{ marginTop: '8px' }}>
                                                <CitySelect
                                                    id="city"
                                                    countryid={countryid.id}
                                                    stateid={stateid.id}
                                                    onChange={handleCityChange}
                                                    placeHolder="Select City"
                                                    className="custom-input block w-full"
                                                    required
                                                />
                                            </div>
                                        </div>


                                        {/* File Upload */}
                                        <div className="mb-2">
                                            <div style={{ position: "relative", display: "inline-block", width: "100%", marginTop: '8px' }}>
                                                <input
                                                    type="file"
                                                    name='file'
                                                    id="additionalScreenshot11"
                                                    style={{
                                                        position: "absolute",
                                                        opacity: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        cursor: "pointer",
                                                    }}
                                                    onChange={(event) => handleFileChange(event)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    style={{
                                                        backgroundColor: "#f9f9f9",
                                                        color: "gray",
                                                        width: "100%",
                                                        padding: "10px",
                                                        borderRadius: "10px",
                                                        border: "1px solid #ccc",
                                                        textAlign: "center",
                                                        fontSize: "14px",
                                                        fontWeight: "bold",
                                                        cursor: "pointer",
                                                        position: "relative",
                                                        zIndex: 1,
                                                        overflow: "hidden",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                    onClick={
                                                        () => document.getElementById("additionalScreenshot11").click()
                                                    }
                                                >
                                                    <i className="fas fa-upload" style={{ marginRight: "8px" }}></i>
                                                    {additionalScreenshot ? additionalScreenshot.name : "Upload Image"}
                                                </button>
                                            </div>
                                        </div>


                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-3 text-center">
                                        <button type="submit" className="flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"              >
                                            Update Profile
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>


        </section>
    );
}
