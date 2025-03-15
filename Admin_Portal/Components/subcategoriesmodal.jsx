import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
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
import Form from "react-bootstrap/Form";
import Cookies from 'js-cookie';

export default function SubcategoriesModal() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [addSubModal, setAddSubModal] = useState(false);
  const [subcategoryModal, setSubcategoryModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [id, setId] = useState("");
  const [updatename, setUpdatename] = useState("");
  const [name, setName] = useState("");

  const toggleShow = () => setBasicModal(!basicModal);
  const toggleUpdate = () => setUpdateModal(!updateModal);
  const toggleAddSub = () => setAddSubModal(!addSubModal);
     useEffect(() => {
        setShow(true);
        if (Cookies.get("mode") === "light") {
          document.body.className = "light-mode";
        } else {
          document.body.className = "dark-mode";
        }
      }, []);

  // Mock data for testing purposes
  const mockData = [
    {
      Id: 1,
      brandName: "CategoryA",
      Active: 1,
      subcategories: [
        { Id: 1, subcategoryName: "SubCategoryA1", Active: 1 },
        { Id: 2, subcategoryName: "SubCategoryA2", Active: 0 },
      ],
    },
    // {
    //   Id: 2,
    //   brandName: "CategoryB",
    //   Active: 0,
    //   subcategories: [],
    // },
  ];

  useEffect(() => {
    setShow(true);
    setCategories(mockData); // Set the mock data
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Subcategory?")) {
      setCategories(
        categories.map((category) => {
          if (category.Id === selectedCategoryId) {
            return {
              ...category,
              subcategories: category.subcategories.filter(
                (subcategory) => subcategory.Id !== id
              ),
            };
          }
          return category;
        })
      );
    }
  };

  const handleAddSubcategory = (event) => {
    event.preventDefault();
    setSubmit(true);

    setTimeout(() => {
      setCategories(
        categories.map((category) => {
          if (category.Id === selectedCategoryId) {
            const newSubcategory = {
              Id: category.subcategories.length + 1,
              subcategoryName: name,
              Active: 1,
            };
            return {
              ...category,
              subcategories: [...category.subcategories, newSubcategory],
            };
          }
          return category;
        })
      );
      setName("");
      setSubmit(false);
      setAddSubModal(false);
    }, 1000);
  };

  const handleUpdateSubcategory = (event) => {
    event.preventDefault();
    setSubmit(true);

    setTimeout(() => {
      setCategories(
        categories.map((category) => {
          if (category.Id === selectedCategoryId) {
            return {
              ...category,
              subcategories: category.subcategories.map((subcategory) =>
                subcategory.Id === id
                  ? { ...subcategory, subcategoryName: updatename }
                  : subcategory
              ),
            };
          }
          return category;
        })
      );
      setSubmit(false);
      setUpdateModal(false);
    }, 1000);
  };

  const handleSwitchChange = (active, subcategoryId) => {
    setCategories(
      categories.map((category) => {
        if (category.Id === selectedCategoryId) {
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) =>
              subcategory.Id === subcategoryId
                ? { ...subcategory, Active: active === 1 ? 0 : 1 }
                : subcategory
            ),
          };
        }
        return category;
      })
    );
  };

  return (
    <div className="siderow" style={{ height: "100vh" }}>
      <div className="sidecol1">
        {/* <Sidebar /> */}
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          {/* <h1
            className="dashboard"
            style={{ textAlign: "left", paddingTop: "40px", fontWeight: "bolder" }}
          >
            Subcategory
          </h1> */}

<div
  className="relative sm:rounded-lg"
  style={{ marginTop: "30px" }}
>
  {/* Button and category section outside overflow-x */}
  {categories.map((category) => (
    <div key={category.Id} style={{ marginBottom: '20px' }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <h3>{category.brandName}</h3>
        <MDBBtn
          size="sm"
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setSelectedCategoryId(category.Id);
            setAddSubModal(true);
          }}
        >
          Add Subcategory
        </MDBBtn>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">

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
  <tbody id="tablebody">
    {category.subcategories.map((subcategory, index) => (
      <tr className="border-b" key={subcategory.Id}>
        <th
          scope="row"
          className="px-6 py-4 font-medium whitespace-nowrap"
        >
          {index + 1}
        </th>
        <td className="px-6 py-4">{subcategory.subcategoryName}</td>
        <td className="px-6 py-4">
          {subcategory.Active === 1 ? "Active" : "Inactive"}
        </td>
        <td className="px-6 py-4">
          <MDBSwitch
            checked={subcategory.Active === 1}
            onChange={() =>
              handleSwitchChange(subcategory.Active, subcategory.Id)
            }
          />
        </td>
        <td className="px-6 py-4">
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={() => {
              setId(subcategory.Id);
              setUpdatename(subcategory.subcategoryName);
              setSelectedCategoryId(category.Id);
              setUpdateModal(true);
            }}
          >
            <i
              className="fa fa-edit"
              style={{ color: "green" }}
            ></i>
          </a>
        </td>
        <td className="px-6 py-4">
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={() => {
              setSelectedCategoryId(category.Id);
              handleDelete(subcategory.Id);
            }}
          >
            <i
              className="fa fa-trash"
              style={{ color: "red" }}
            ></i>
          </a>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Subcategory Modal */}
      <MDBModal show={addSubModal} setShow={setAddSubModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Add Subcategory</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleAddSub}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleAddSubcategory}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Name</p>
                  <Form.Control
                    type="text"
                    placeholder="Subcategory Name"
                    size="lg"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
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
                    <span>Add</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Update Subcategory Modal */}
      <MDBModal show={updateModal} setShow={setUpdateModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Update Subcategory</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleUpdate}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleUpdateSubcategory}>
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>Name</p>
                  <Form.Control
                    type="text"
                    placeholder="Subcategory Name"
                    size="lg"
                    value={updatename}
                    onChange={(event) => {
                      setUpdatename(event.target.value);
                    }}
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
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
                    <span>Update</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
