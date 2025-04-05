import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
  MDBSwitch,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { FaFilter } from "react-icons/fa"; // Filter icon
import { UserModal } from "./userModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function ManageUsers() {
  const navigate = useHistory();
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState(""); // Role filter state
  const [statusFilter, setStatusFilter] = useState(""); // Active/Inactive filter
  const [showDetailsModal, setShowDetailsModal] = useState(false); // For toggling the right-to-left modal
  const [additionalScreenshot, setAdditionalScreenshot] = useState(null);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState(""); // for Seller
  const [description, setDescription] = useState(""); // for Seller

  const toggleShow = () => setBasicModal(!basicModal);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleUpdate = () => setUpdateModal(!updateModal);

  function getData() {
    fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/admin/user/get`, {
      method: "GET",
      headers: {
        "api-key": process.env.REACT_APP_BACKEND_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let filtered = data;

        // Apply role filter
        if (roleFilter) {
          filtered = filtered.filter(
            (user) => user.Role.toLowerCase() === roleFilter.toLowerCase()
          );
        }

        // Apply active status filter
        if (statusFilter !== "") {
          const activeStatus = statusFilter === "1";
          filtered = filtered.filter((user) => user.Active === activeStatus);
        }

        setUsers(filtered);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    getData();
  }, [roleFilter, statusFilter]);

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const uploadToCloudinary = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "BunyadClick_images"); // Replace with your Cloudinary upload preset

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dp2uikrdw/image/upload", // Replace 'your_cloud_name' with actual Cloudinary cloud name
        formData
      );

      // Return the secure URL of the uploaded image
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const form = e.target;
    const data = {
      name: form.username.value,
      email: form.email.value,
      phoneNumber: form.phone.value,
      country: form.country.value,
      state: form.state.value,
      city: form.city.value,
      role: form.role.value,
      aboutMe: form.about.value,
      image: await uploadToCloudinary(additionalScreenshot),
    };

    fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/admin/user/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.REACT_APP_BACKEND_API_KEY,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          toast.success("User created successfully!");
          getData(); // Refresh user list
          setBasicModal(false);
        } else {
          toast.error(response.message || "Failed to create user.");
        }
      })
      .catch(() => {
        toast.error("Something went wrong. Try again later.");
      })
      .finally(() => {
        setSubmit(false);
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const isBuyer = roleFilter.toLowerCase() === "buyer"; // infer from filter
    const form = e.target;

    const payload = {
      Name: form.username.value,
      PhoneNumber: form.phone.value,
      Country: form.country.value,
      State: form.state.value,
      City: form.city.value,
      AboutMe: form.about.value,
      ...(additionalScreenshot && {
        Image: await uploadToCloudinary(additionalScreenshot),
      }),
    };

    // Add seller-specific fields
    // if (!isBuyer) {
    //   payload.Title = form.title.value;
    //   payload.Description = form.description.value;
    // }

    const endpoint = `/auth/updateUser/${id}`;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}${endpoint}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "User updated successfully.");
        setUpdateModal(false);
        getData();
      } else {
        toast.error(result.message || "Failed to update user.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating user.");
    } finally {
      setSubmit(false);
    }
  };

  const handleDelete = (id) => {
    alert(`Delete User functionality not implemented. User ID: ${id}`);
  };

  const handleSwitchChange = async (active, userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/auth/admin/user/toggle/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "User status updated successfully.");
        getData(); // Refresh list after toggle
      } else {
        toast.error(result.message || "Failed to update user status.");
      }
    } catch (error) {
      toast.error("Something went wrong while toggling user status.");
      console.error(error);
    }
  };

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <div
            className="row align-items-center"
            style={{ paddingTop: "40px" }}
          >
            {/* Title Section */}
            <div className="col-12 col-md-6 mt-1">
              <h1
                className="dashboard"
                style={{
                  textAlign: "left",
                  fontWeight: "bolder",
                  marginBottom: "0", // Keeps it aligned with filters
                }}
              >
                Manage Users
              </h1>
            </div>

            {/* Filters and Button Section */}
            <div
              className="col-12 col-md-6 mt-1"
              style={{
                display: "flex",
                justifyContent: "center", // Align filters and button to the right
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Form.Select
                style={{
                  flex: "0 0 auto", // Prevents stretching
                  maxWidth: "200px",
                }}
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  // setTimeout(getData, 0); // Ensure state is updated before fetch
                }}
                aria-label="Role Filter"
              >
                <option value="">Select Role</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </Form.Select>

              <Form.Select
                style={{
                  flex: "0 0 auto", // Prevents stretching
                  maxWidth: "200px",
                }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  // setTimeout(getData, 0); // Ensure state is updated before fetch
                }}
                aria-label="Status Filter"
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Form.Select>

              <MDBBtn
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  flex: "0 0 auto",
                  height: "45px",
                  borderRadius: "8px",
                  padding: "0 20px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  setBasicModal(true);
                }}
              >
                <i
                  className="fa fa-plus"
                  style={{ fontSize: "15px", marginRight: "5px" }}
                ></i>
                Add User
              </MDBBtn>
            </div>
          </div>

          <div
            className="relative overflow-x-auto shadow-md sm:rounded-lg"
            style={{ borderRadius: 0, marginTop: "30px" }}
          >
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                className="uppercase"
                id="tablehead"
                style={{ padding: "10px", color: "#313a50" }}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Sr
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {users.map((user, index) => (
                  <tr className="border-b" key={user.Id}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{user.Name}</td>
                    <td className="px-6 py-4">{user.Email}</td>
                    <td className="px-6 py-4">
                      {user.Active === true ? "Active" : "Inactive"}
                    </td>

                    <td className="px-6 py-4">{user.Role}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {/* Toggle Switch */}
                        <MDBSwitch
                          checked={user.Active === true}
                          onChange={() =>
                            handleSwitchChange(user.Active, user.Id)
                          }
                        />
                        {/* Edit Icon */}
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => {
                            setId(user.Id);
                            setUsername(user.Name);
                            setEmail(user.Email);
                            setPhone(user.PhoneNumber || "");
                            setCountry(user.Country || "");
                            setStateName(user.State || "");
                            setCity(user.City || "");
                            setAbout(user.AboutMe || "");
                            setImage(user.Image || "");
                            setTitle(user.Title || ""); // seller only
                            setDescription(user.Description || ""); // seller only
                            setUpdateModal(true);
                          }}
                        >
                          <i
                            className="fa fa-edit"
                            style={{ color: "green" }}
                          ></i>
                        </a>

                        {/* Delete Icon */}
                        {/* <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => handleDelete(user.Id)}
                        >
                          <i
                            className="fa fa-trash"
                            style={{ color: "red" }}
                          ></i>
                        </a> */}
                        {/* Details Icon */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        l
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <span
                          onClick={() => {
                            Cookies.set("role", user.Role);
                            Cookies.set("id", user.Id);
                            navigate.push("/userModal");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <i
                            className="fa fa-eye"
                            style={{ color: "blue" }}
                          ></i>
                        </span>
                        {/* <Link to="/userModal">
                          <i
                            className="fa fa-eye"
                            style={{ color: "blue" }}
                          ></i>
                        </Link> */}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Add User</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleAdd}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    id="card"
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    id="card"
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    id="card"
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Country"
                    name="country"
                    id="card"
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="State"
                    name="state"
                    style={{ borderRadius: 0, color: "black" }}
                    id="card"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="City"
                    name="city"
                    style={{ borderRadius: 0, color: "black" }}
                    required
                    id="card"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Select
                    name="role"
                    required
                    id="card"
                    style={{ borderRadius: 0, color: "black" }}
                  >
                    <option value="">Select Role</option>
                    <option value="Seller">Seller</option>
                    <option value="Buyer">Buyer</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="About Me"
                    name="about"
                    id="card"
                    required
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    placeholder="Image URL"
                    name="image"
                    id="card"
                    required
                    onChange={handleFileChange(setAdditionalScreenshot)}
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn
                  type="submit"
                  className="btnsc"
                  style={{ borderRadius: 0 }}
                >
                  {submit ? <MDBSpinner color="info" /> : <span>Add User</span>}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Update User Modal */}
      <MDBModal show={updateModal} setShow={setUpdateModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Update User</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleUpdate}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleUpdate}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    id="card"
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    id="card"
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Country"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    id="card"
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="State"
                    name="state"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    required
                    id="card"
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="City"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    id="card"
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="About Me"
                    name="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    required
                    id="card"
                    style={{ borderRadius: 0, color: "black" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    placeholder="Image URL"
                    name="image"
                    // value={image}
                    onChange={handleFileChange(setAdditionalScreenshot)}
                    style={{ borderRadius: 0, color: "black" }}
                    id="card"
                  />
                </Form.Group>

                {roleFilter.toLowerCase() === "Seller" && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        id="card"
                        style={{ borderRadius: 0, color: "black" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        id="card"
                        style={{ borderRadius: 0, color: "black" }}
                      />
                    </Form.Group>
                  </>
                )}
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn
                  type="submit"
                  className="btnsc"
                  style={{ borderRadius: 0 }}
                >
                  {submit ? (
                    <MDBSpinner color="info" />
                  ) : (
                    <span>Update User</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBModal
        show={showDetailsModal}
        setShow={setShowDetailsModal}
        tabIndex="-1"
      >
        <MDBModalDialog
          className={`modal-slide-in ${showDetailsModal ? "open" : ""}`}
          style={{ width: "400px" }}
        >
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>User Details</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setShowDetailsModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody></MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
