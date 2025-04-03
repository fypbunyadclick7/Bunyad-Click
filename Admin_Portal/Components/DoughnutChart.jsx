import React from "react";
import Chart from "react-apexcharts";

function ChartsPage({ users , color}) {
  // Check if users is null or undefined
  if (!users) {
    // You can return some default UI or a loading state here
    return <div>Loading...</div>;
  }

  // Transform data to the required format
  const transformedData = users.map((item) => ({
    countryname: item.active === 0 ? "Inactive" : "Active",
    medal: item.count,
  }));

  // Extract country names and medals from transformed data
  const countryname = transformedData.map((item) => item.countryname) || [];
  const medal = transformedData.map((item) => item.medal) || [];
  // Function to generate random colors
  // const getRandomColor = () =>
  //   `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  // var randomColors = [getRandomColor(), getRandomColor()];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Chart
        type="donut"
        width={500}
        height={300}
        series={medal}
        options={{
          labels: countryname,
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    showAlways: true,
                    fontSize: 24,
                    color: "#f90000",
                  },
                },
              },
            },
          },
          dataLabels: {
            enabled: true,
          },
          legend: {
            show: false,
          },
          colors: color, // Assign random colors
          annotations: {
            title: {
              text: "Medal Country Name",
              position: "bottom",
              offsetY: 15, // Adjust the offset based on your preference
              style: {
                fontSize: "16px",
                color: "#333", // Title text color
              },
            },
          },
        }}
      />
    </div>
  );
}

export default ChartsPage;
