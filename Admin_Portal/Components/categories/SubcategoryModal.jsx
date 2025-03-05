import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
  MDBSwitch,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast"; // Importing react-hot-toast
import axios from "axios"; // Importing axios

const SubcategoryModal = ({ show, toggleShow, category }) => {
  const [Category, setCategory] = useState(category);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  const fetchCategories = () => {
    setLoading1(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_API_URL}/job/getCategories`, {
        headers: {
          "api-key": process.env.REACT_APP_BACKEND_API_KEY,
        },
      })
      .then((response) => {
        const selectedCategory = response.data.find(
          (item) => item.Id === category?.Id
        );
        if (selectedCategory) {
          setCategory(selectedCategory); // Set only the matched category
        }
        setLoading1(false);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  useEffect(() => {
    if (show) {
      if (Cookies.get("mode") === "light") {
        document.body.className = "light-mode";
      } else {
        document.body.className = "dark-mode";
      }
    }
    setCategory(category);
    fetchCategories();
  }, [show, category]);

  const handleAddSubcategory = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/job/admin/subCategory/add`,
        {
          CategoryId: Category?.Id,
          Title: name,
        },
        {
          headers: {
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
        }
      );
      setLoading(false);
      if (response.data.success) {
        toast.success(response.data.message); // Show success toast
        fetchCategories(); // Fetch categories after the request
        setName(""); // Clear input field
      } else {
        toast.error(response.data.message); // Show error toast
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to add subcategory");
    }
  };

  const handleUpdateSubcategory = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/job/admin/subCategory/update/${id}`,
        {
          Title: updatedName,
        },
        {
          headers: {
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message); // Show success toast
        fetchCategories(); // Fetch categories after the request
        setEditingId(null); // Exit editing mode
      } else {
        toast.error(response.data.message); // Show error toast
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update subcategory");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/job/admin/subCategory/toggle/${id}`,
        {},
        {
          headers: {
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message); // Show success toast
        fetchCategories(); // Fetch categories after the request
      } else {
        toast.error(response.data.message); // Show error toast
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to toggle subcategory status");
    }
  };

  return (
    <>
      <Toaster position="top-right" /> {/* Add the toaster to the top right */}
      <MDBModal
        show={show}
        setShow={() => {}}
        tabIndex="-1"
        size="lg"
        animationDirection="right"
        style={{
          display: show ? "block" : "none",
        }}
      >
        <MDBModalDialog
          side
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            margin: 0,
            transform: show ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s ease-in-out",
            width: "80%",
            minWidth: "320px",
          }}
        >
          <MDBModalContent
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
            id="card"
          >
            <MDBModalHeader>
              <MDBModalTitle>Sub Categories</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleShow} />
            </MDBModalHeader>
            <MDBModalBody>
              <div
                key={Category?.Id && Category?.Id}
                style={{ marginBottom: "20px" }}
              >
                <h3 style={{ textAlign: "left" }}>
                  {Category?.Title && Category?.Title}
                </h3>

                <Form
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent form from submitting
                    handleAddSubcategory();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <Form.Control
                    type="text"
                    placeholder="Add Subcategory"
                    value={name}
                    id="card"
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginRight: "10px" }}
                  />
                  <MDBBtn
                    size="sm"
                    type="submit" // Change button type to submit
                    style={{ borderRadius: "0" }}
                    disabled={loading}
                  >
                    {loading ? <MDBSpinner color="info" /> : "Add"}
                  </MDBBtn>
                </Form>
                {loading1 ? (
                  <MDBSpinner color="info" style={{ marginTop: "50%" }} />
                ) : (
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
                          SubCategory Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Edit
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Category && Category?.SubCategories.length > 0 ? (
                        Category?.SubCategories.map((subcategory, index) => (
                          <tr className="border-b" key={subcategory?.Id}>
                            <th scope="row" className="px-6 py-4">
                              {index + 1}
                            </th>
                            <td className="px-6 py-4">
                              {editingId === subcategory?.Id ? (
                                <Form.Control
                                  type="text"
                                  value={updatedName}
                                  onChange={(e) =>
                                    setUpdatedName(e.target.value)
                                  }
                                  onBlur={() =>
                                    handleUpdateSubcategory(subcategory.Id)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleUpdateSubcategory(subcategory.Id);
                                    }
                                  }}
                                  autoFocus
                                />
                              ) : (
                                subcategory?.Title
                              )}
                            </td>
                            <td className="px-6 py-4">{subcategory?.Status}</td>
                            <td className="px-6 py-4">
                              <MDBSwitch
                                checked={subcategory?.Status === "Active"}
                                onChange={() =>
                                  handleToggleStatus(subcategory?.Id)
                                }
                              />
                            </td>
                            <td className="px-6 py-4">
                              <i
                                className="fa fa-edit"
                                style={{ color: "green", cursor: "pointer" }}
                                onClick={() => {
                                  setEditingId(subcategory?.Id);
                                  setUpdatedName(subcategory?.Title);
                                }}
                              ></i>
                            </td>
                            <td className="px-6 py-4">
                              <i
                                className="fa fa-trash"
                                style={{ color: "red", cursor: "pointer" }}
                              ></i>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-4 text-center text-gray-500"
                            style={{ marginRight: "30px" }}
                          >
                            No Subcategories Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default SubcategoryModal;
