import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import { MDBSwitch } from "mdb-react-ui-kit"; // Importing MDBSwitch
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export default function ManageBids() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [id, setId] = useState("");
  const toggleShow = () => setBasicModal(!basicModal);

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
    const randomOrders = [
      {
        seller: "John Doe",
        jobName: "Web Developer",
        price: Math.floor(Math.random() * 500) + 100,
        duration: `${Math.floor(Math.random() * 10) + 1} days`,
        coverLetter: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: Math.random() > 0.5, // Random status (true = Active, false = Inactive)
        Id: "1"
      },
      {
        seller: "Jane Smith",
        jobName: "Graphic Designer",
        price: Math.floor(Math.random() * 500) + 100,
        duration: `${Math.floor(Math.random() * 10) + 1} days`,
        coverLetter: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: Math.random() > 0.5,
        Id: "2"
      },
      {
        seller: "Sam Wilson",
        jobName: "Content Writer",
        price: Math.floor(Math.random() * 500) + 100,
        duration: `${Math.floor(Math.random() * 10) + 1} days`,
        coverLetter: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: Math.random() > 0.5,
        Id: "3"
      },
      {
        seller: "Alice Johnson",
        jobName: "SEO Specialist",
        price: Math.floor(Math.random() * 500) + 100,
        duration: `${Math.floor(Math.random() * 10) + 1} days`,
        coverLetter: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: Math.random() > 0.5,
        Id: "4"
      },
    ];
    setData(randomOrders);
  }

  const toggleStatus = (index) => {
    const updatedData = [...data];
    updatedData[index].status = !updatedData[index].status;
    setData(updatedData);
  };

  const handleSwitchChange = (active, id) => {
    const updatedData = [...data];
    const index = updatedData.findIndex((item) => item.id === id);
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Manage Bids
            </h1>
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
                    Seller
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Job Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Delete
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
                    <td className="px-6 py-4">{item.seller}</td>
                    <td className="px-6 py-4">{item.jobName}</td>
                    <td className="px-6 py-4">{item.price} Rs</td>
                    <td className="px-6 py-4">{item.duration}</td>
                    <td className="px-6 py-4">
                      <MDBSwitch
                        checked={item.status}
                        onChange={() => handleSwitchChange(item.status, item.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => handleDelete(item.Id)}
                      >
                        <i
                          className="fa fa-trash"
                          style={{ color: "red" }}
                        ></i>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                    <a
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <Link to="/userModal">
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
