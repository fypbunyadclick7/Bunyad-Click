import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { MDBBtn, MDBSwitch } from "mdb-react-ui-kit";
import AddCategoryModal from "./categories/AddCategoryModal";
import UpdateCategoryModal from "./categories/UpdateCategoryModal";
import DeleteCategoryModal from "./categories/DeleteCategoryModal";
import SubcategoryModal from "./categories/SubcategoryModal";
import axios from "axios"; // Import Axios
import Cookies from "js-cookie";

export default function Categories() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState("");
  const [updatename, setUpdatename] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [Category, setCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch categories from the API using Axios
  const fetchCategories = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_API_URL}/job/getCategories`, {
        headers: {
          "api-key": process.env.REACT_APP_BACKEND_API_KEY,
        },
      })
      .then((response) => {
        setShow(true);
        setData(response.data); // Set the fetched data
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    fetchCategories(); // Initial fetch
  }, []);

  const handleSwitchChange = (Id) => {
    // Toggle category status using Axios
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_API_URL}/job/admin/category/toggle/${Id}`,
        {}, // Empty body as we don't need to send any data
        {
          headers: {
            "api-key": process.env.REACT_APP_BACKEND_API_KEY, // API key in the headers
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          fetchCategories(); // Re-fetch categories to reflect the updated status
        }
      })
      .catch((error) =>
        console.error("Error updating category status:", error)
      );
  };

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Category
            </h1>
            <MDBBtn
              style={{
                height: "50px",
                marginTop: "3%",
                borderRadius: "0",
              }}
              onClick={() => {
                setBasicModal(true);
              }}
            >
              Add Categories
            </MDBBtn>
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
                    Category Name
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
                  {/* <th scope="col" className="px-6 py-3">
                    Delete
                  </th> */}
                  <th scope="col" className="px-6 py-3">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {data.map((category, index) => (
                  <tr className="border-b" key={category.Id}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{category.Title}</td>
                    <td className="px-6 py-4">{category.Status}</td>
                    <td className="px-6 py-4">
                      <MDBSwitch
                        checked={category.Status === "Active"}
                        onChange={() => handleSwitchChange(category.Id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => {
                          setId(category.Id);
                          setUpdatename(category.Title);
                          setUpdateModal(true);
                        }}
                      >
                        <i
                          className="fa fa-edit"
                          style={{ color: "green" }}
                        ></i>
                      </a>
                    </td>
                    {/* <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => {
                          setDeleteId(category.Id);
                          setDeleteModal(true);
                        }}
                      >
                        <i className="fa fa-trash" style={{ color: "red" }}></i>
                      </a>
                    </td> */}
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModalOpen(true);
                          setCategory(category);
                        }}
                      >
                        <i className="fa fa-eye" style={{ color: "blue" }}></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddCategoryModal
        show={basicModal}
        toggleShow={() => setBasicModal(false)}
        fetchCategories={fetchCategories}
      />

      <UpdateCategoryModal
        show={updateModal}
        toggleShow={() => setUpdateModal(false)}
        Id={id}
        Name={updatename}
        fetchCategories={fetchCategories}
      />

      <DeleteCategoryModal
        show={deleteModal}
        toggleShow={() => setDeleteModal(false)}
        Id={deleteId}
        fetchCategories={fetchCategories}
      />

      <SubcategoryModal
        show={isModalOpen}
        toggleShow={() => setIsModalOpen(false)}
        category={Category}
      />
    </div>
  );
}
