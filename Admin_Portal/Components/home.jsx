import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import ChartsPage from "./DoughnutChart";
import Linechart from "./lineChart";
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import Cookies from "js-cookie";

export default function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [Grapgdata, setGrapgdata] = useState([]);
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [brands, setBrands] = useState(0);
  const [orders, setOrders] = useState(0);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
        // Generate random data for dashboard metrics
        setUsers(Math.floor(Math.random() * 1000) + 1);
        setBrands(Math.floor(Math.random() * 100) + 1);
        setOrders(Math.floor(Math.random() * 500) + 1);
        setProducts(Math.floor(Math.random() * 1000) + 1);
        setRevenue((Math.random() * 100000).toFixed(2));

    // Generate random data for dashboard
    const randomData = {
      instructor: [{ count: 20, active: 1 }, { count: 5, active: 0 }],
    course: [{ count: 30, active: 1 }, { count: 10, active: 0 }],
    users: [{ count: 40, active: 1 }, { count: 15, active: 0 }],
    };

    const randomGraphData = [
      { Day: "Monday", Course: "React", Count: Math.floor(Math.random() * 50) },
      { Day: "Tuesday", Course: "React", Count: Math.floor(Math.random() * 50) },
      { Day: "Wednesday", Course: "Angular", Count: Math.floor(Math.random() * 50) },
      { Day: "Thursday", Course: "Vue", Count: Math.floor(Math.random() * 50) },
      { Day: "Friday", Course: "React", Count: Math.floor(Math.random() * 50) },
      { Day: "Saturday", Course: "Angular", Count: Math.floor(Math.random() * 50) },
      { Day: "Sunday", Course: "Vue", Count: Math.floor(Math.random() * 50) },
    ];

    setData(randomData);
    setGrapgdata(randomGraphData);
  }, []);

  // Create an object to store counts for each course
  const courseCounts = {};
  if (Grapgdata && Grapgdata.length > 0) {
    // Iterate over the input data and populate the counts
    Grapgdata.forEach((entry) => {
      const { Day, Course, Count } = entry;

      // Initialize course entry if not present
      if (!courseCounts[Course]) {
        courseCounts[Course] = { name: Course, data: [0, 0, 0, 0, 0, 0, 0] };
      }

      // Update count for the corresponding day
      const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(Day);
      courseCounts[Course].data[dayIndex] = Count;
    });
  }

  // Convert the object into an array
  const resultArray = Object.values(courseCounts);

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
      <MDBRow style={{ margin: "5px", marginTop: "30px" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Dashboard
            </h1>
            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="home"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Brands
                    </div>
                    <h2>{brands}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="box-open"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Products
                    </div>
                    <h2>{products}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="users"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Users
                    </div>
                    <h2>{users}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="shopping-cart"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Orders
                    </div>
                    <h2>{orders}</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard style={{ marginTop: "5px", borderRadius: 0 }} id="card">
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <MDBIcon
                        icon="money-bill-wave"
                        className="mr-2"
                        style={{ marginRight: "5px" }}
                      />
                      Revenue
                    </div>
                    <h2>{revenue} Rs</h2>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        <MDBRow style={{ margin: "5px", marginTop: "30px" }}>
          <h1
            className="dashboard"
            style={{
              textAlign: "left",
              paddingTop: "40px",
              fontWeight: "bolder",
            }}
          >
            Dashboard
          </h1>
          <MDBCol md="4">
            <ChartsPage users={data.instructor} color={["#1d9cfb", "#00e396"]} />
            <h4>Instructors</h4>
          </MDBCol>

          <MDBCol md="4">
            <ChartsPage users={data.course} color={["#00FF00", "#FFA500"]} />
            <h4>Courses</h4>
          </MDBCol>

          <MDBCol md="4">
            <ChartsPage users={data.users} color={["#FF0000", "#0000FF"]} />
            <h4>Users</h4>
          </MDBCol>
        </MDBRow>
        
        {/* Line Chart */}
        <MDBRow>
          <Linechart product={resultArray} />
        </MDBRow>

      </div>
    </div>
  );
}
