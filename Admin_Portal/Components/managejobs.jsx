import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { MDBSwitch , MDBBtn} from "mdb-react-ui-kit"; // Importing MDBSwitch
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";



export default function ManageJobs() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [id, setId] = useState("");
  const toggleShow = () => setBasicModal(!basicModal);
    const [roleFilter, setRoleFilter] = useState("");  // Role filter state
      const [statusFilter, setStatusFilter] = useState(""); // Active/Inactive filter
    
  

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") == "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    generateRandomData();
  }, []);

  function generateRandomData() {
    const randomJobs = [
      {
        title: "Full Stack Developer",
        timeline: "2 months",
        budget: "5000 Rs",
        status: Math.random() > 0.5, // Random status (true = Active, false = Inactive)
        category: "Development",
        subCategory: "Web Development",
        Id: "1"
      },
      {
        title: "Graphic Designer",
        timeline: "1 month",
        budget: "2000 Rs",
        status: Math.random() > 0.5,
        category: "Design",
        subCategory: "Logo Design",
        Id: "2"
      },
      {
        title: "SEO Specialist",
        timeline: "3 months",
        budget: "3000 Rs",
        status: Math.random() > 0.5,
        category: "Marketing",
        subCategory: "SEO Optimization",
        Id: "3"
      },
      {
        title: "Content Writer",
        timeline: "1 month",
        budget: "1500 Rs",
        status: Math.random() > 0.5,
        category: "Writing",
        subCategory: "Blog Posts",
        Id: "4"
      },
    ];
    setData(randomJobs);
  }

  const handleSwitchChange = (active, id) => {
    const updatedData = [...data];
    const index = updatedData.findIndex((item) => item.Id === id);
    if (index !== -1) {
      updatedData[index].status = !active;
      setData(updatedData);
    }
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.Id !== id);
    setData(updatedData);
  };

  return (
    <div className="siderow">
    <div className="sidecol1">
      <Sidebar />
    </div>
    <div className="sidecol2">
      <div className={`welcome-animation ${show ? "show" : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap", // Ensures responsiveness
            alignItems: "center",
          }}
        >
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
              flex: "1 1 auto", // Takes available space
            }}
          >
            Manage Jobs
          </h1>
  
          <div
    className="col-12 col-md-6 mt-1"
    style={{
      display: "flex",
      justifyContent: "center", // Align filters and button to the right
      flexWrap: "wrap",
      alignItems:'center',
      gap: "10px",
      paddingTop: "40px",
      
    }}
  >
    

    <Form.Select
      style={{
        flex: "0 0 auto", // Prevents stretching
        maxWidth: "200px",
      }}
      // eslint-disable-next-line no-undef
      value={statusFilter}
      onChange={(e) => {
        // eslint-disable-next-line no-undef
        setStatusFilter(e.target.value);
        setData();
      }}
      aria-label="Status Filter"
    >
      <option >Select Status</option>
      <option >Assigned</option>
      <option >Completed</option>
      <option >Active</option>
    </Form.Select>
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
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Timeline
                </th>
                <th scope="col" className="px-6 py-3">
                  Budget
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  SubCategory
                </th>
                <th scope="col" className="px-6 py-3">
                  Delete
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Details
                </th>
              </tr>
            </thead>
            <tbody id="tablebody">
              {data.map((item, index) => (
                <tr className="border-b" key={index}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap "
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{item.timeline}</td>
                  <td className="px-6 py-4">{item.budget}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.subCategory}</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => handleDelete(item.Id)}
                    >
                      <i className="fa fa-trash" style={{ color: "red" }}></i>
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <MDBSwitch
                      checked={item.status}
                      onChange={() => handleSwitchChange(item.status, item.Id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <a
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <Link to="/jobModal">
                        <i className="fa fa-eye" style={{ color: "blue" }}></i>
                      </Link>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );  
}
