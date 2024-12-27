import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import toast, { Toaster } from 'react-hot-toast'; // Importing toast and Toaster from react-hot-toast


const FilterComponent = ({ onApplyFilters, onFilterResults }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategory, setSubcategory] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]); // Changed to array
  const [price, setPrice] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/job/getCategories`,
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        setCategories(response.data); // Set categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId) // Remove if already selected
        : [...prevSelected, categoryId] // Add if not selected
    );
    setSubcategory({});
  };

  const handleSubcategoryToggle = (subcategoryId) => {
    setSubcategory((prev) => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId],
    }));
  };

  const handleApplyFilters = async () => {
    setLoading(true);
  
    // Determine maxPrice
    const maxPrice = price && price.startsWith("Upto")
      ? parseInt(price.replace("Upto $", ""), 10)
      : price && price.startsWith("Above")
      ? parseInt(price.replace("Above $", ""), 10)
      : 5000; // Default if price format doesn't match
  
    console.log("Selected maxPrice:", maxPrice); // For debugging
  
    // Duration logic
    const durationInDays = duration?.includes("hour")
      ? 1
      : duration?.includes("Day")
      ? 1
      : duration?.includes("Week")
      ? 7
      : duration?.includes("Month")
      ? 30
      : duration?.includes("Others")
      ? 0 // Handle 'Others' case
      : null;
  
    // Prepare parameters for API request
    const params = {
      minPrice: 0,
      maxPrice: maxPrice,
      duration: durationInDays,
      categoryId: selectedCategories.join(","),
      subcategoryId: Object.keys(subcategory).filter((key) => subcategory[key]).join(","),
    };
  
    // Clean params before making the API call
    Object.keys(params).forEach(
      (key) => (params[key] === null || params[key] === undefined) && delete params[key]
    );
  
    // try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/job/getFilteredSellerJobs`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
          params,
        }
      );
      onApplyFilters({ selectedCategory, subcategory, price, duration });
      console.log(response.data.jobs)
      // onFilterResults(response.data.jobs); // Assuming response contains filtered jobs
    // } catch (error) {
    //   console.error("Error fetching filtered jobs:", error);
    //   toast.error("Failed to apply filters, please try again later.");
    // } finally {
    //   setLoading(false); // Set loading state to false
    //   setModalOpen(false); // Close the modal
    // }
    console.log("Applied filters:", params); // For debugging
  };
  

  

  const styles = {
    container: {
      width: isMobile ? "100%" : "300px",
      padding: isMobile ? "0" : "20px",
      border: isMobile ? "none" : "1px solid #ccc",
      borderRadius: "10px",
      fontFamily: "Arial, sans-serif",
      background: "#f9f9f9",
    },
    header: {
      marginBottom: "20px",
      color: "#333",
    },
    subHeader: {
      marginBottom: "10px",
      color: "#555",
    },
    filterOption: {
      marginBottom: "10px",
      position: "relative",
      paddingLeft: "30px",
      cursor: "pointer",
      userSelect: "none",
      color: "#555",
    },
    checkbox: {
      display: "none",
    },
    checkmark: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "20px",
      width: "20px",
      backgroundColor: "#f0f0f0",
      borderRadius: "4px",
      border: "2px solid #ccc",
      transition: "0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "bold",
      color: "white",
    },
    checkmarkChecked: {
      backgroundColor: "var(--avatar-bg-color)",
      borderColor: "var(--avatar-bg-color)",
    },
    circle: {
      position: "absolute",
      top: 0,
      left: 0,
      height: "20px",
      width: "20px",
      backgroundColor: "#f0f0f0",
      borderRadius: "50%",
      border: "2px solid #ccc",
      transition: "0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    circleChecked: {
      backgroundColor: "var(--avatar-bg-color)",
      borderColor: "var(--avatar-bg-color)",
    },
    applyButton: {
      width: "100%",
      backgroundColor: "#4f46e5",
      color: "white",
      padding: "10px 0",
      fontSize: "16px",
      fontWeight: "bold",
      borderRadius: "5px",
      cursor: "pointer",
    },
    modalContent: {
      padding: "20px",
    },
  };

  return (
    <div>
      {isMobile ? (
        <button style={styles.applyButton} onClick={() => setModalOpen(true)}>
          Apply Filters
        </button>
      ) : (
        <div>
          <div style={styles.container}>
            <h3 style={styles.header}>Filters</h3>
            <div>
              <h5 style={styles.subHeader}>Category</h5>
              {categories.map((category) => (
                <div style={styles.filterOption} key={category.Id}>
                  <label>
                    <input
                      name="category"
                      value={category.Id}
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selectedCategories.includes(category.Id)}
                      onChange={() => handleCategorySelect(category.Id)}
                    />
                    <span
                      style={{
                        ...styles.checkmark,
                        ...(selectedCategories.includes(category.Id)
                          ? styles.checkmarkChecked
                          : {}),
                      }}
                    >
                      {selectedCategories.includes(category.Id) && "✓"}
                    </span>
                    {category.Title.charAt(0).toUpperCase() + category.Title.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <>
                <h5 style={styles.subHeader}>Subcategories</h5>
                {selectedCategories.map((categoryId) => {
                  const category = categories.find((cat) => cat.Id === categoryId);
                  return (
                    <div key={categoryId}>
                      {category?.SubCategories.map((subcat) => (
                        <div style={styles.filterOption} key={subcat.Id}>
                          <label>
                            <input
                              name="subcategory"
                              value={subcat.Id}
                              type="checkbox"
                              style={styles.checkbox}
                              checked={subcategory[subcat.Id]} // Check if subcategory is selected
                              onChange={() => handleSubcategoryToggle(subcat.Id)} // Toggle on change
                            />
                            <span
                              style={{
                                ...styles.checkmark,
                                ...(subcategory[subcat.Id] ? styles.checkmarkChecked : {}),
                              }}
                            >
                              {subcategory[subcat.Id] && "✓"}
                            </span>
                            {subcat.Title.charAt(0).toUpperCase() + subcat.Title.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            )}

            <div>
              <h5 style={styles.subHeader}>Price</h5>
              {["Upto $500", "Upto $1000", "Upto $1500", "Upto $2000", "Above $2000"].map(
                (range, index) => (
                  <div style={styles.filterOption} key={index}>
                    <label>
                    <input
                        type="radio"
                        name="price"
                        style={styles.checkbox}
                        checked={price === range}
                        onChange={() => setPrice(range)} // Ensure this updates the price state correctly
                      />
                      <span
                        style={{
                          ...styles.circle,
                          ...(price === range ? styles.circleChecked : {}),
                        }}
                      ></span>
                      {range}
                    </label>
                  </div>
                )
              )}
            </div>

            <div>
              <h5 style={styles.subHeader}>Duration</h5>
              {["1 hour", "1 Day", "3 Days", "1 Week", "1 Month"].map((range, index) => (
                <div style={styles.filterOption} key={index}>
                  <label>
                    <input
                      type="radio"
                      name="duration"
                      style={styles.checkbox}
                      checked={duration === range}
                      onChange={() => setDuration(range)}
                    />
                    <span
                      style={{
                        ...styles.circle,
                        ...(duration === range ? styles.circleChecked : {}),
                      }}
                    ></span>
                    {range}
                  </label>
                </div>
              ))}
            </div>

            <button
              style={styles.applyButton}
              onClick={handleApplyFilters}
              disabled={loading}
            >
              {loading ? "Applying..." : "Apply Filters"}
            </button>
          </div>
        </div>
      )}

      {/* Modal for mobile view */}
      <MDBModal show={modalOpen} setShow={setModalOpen}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <h5>Filters</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalOpen(false)}
              ></button>
            </MDBModalHeader>
            <MDBModalBody style={styles.modalContent}>
              <div>
                <h5 style={styles.subHeader}>Category</h5>
                {categories.map((category) => (
                  <div style={styles.filterOption} key={category.Id}>
                    <label>
                      <input
                        name="category"
                        value={category.Id}
                        type="checkbox"
                        style={styles.checkbox}
                        checked={selectedCategories.includes(category.Id)}
                        onChange={() => handleCategorySelect(category.Id)}
                      />
                      <span
                        style={{
                          ...styles.checkmark,
                          ...(selectedCategories.includes(category.Id)
                            ? styles.checkmarkChecked
                            : {}),
                        }}
                      >
                        {selectedCategories.includes(category.Id) && "✓"}
                      </span>
                      {category.Title.charAt(0).toUpperCase() + category.Title.slice(1)}
                    </label>
                  </div>
                ))}
              </div>

              {selectedCategories.length > 0 && (
              <>
                <h5 style={styles.subHeader}>Subcategories</h5>
                {selectedCategories.map((categoryId) => {
                  const category = categories.find((cat) => cat.Id === categoryId);
                  return (
                    <div key={categoryId}>
                      {category?.SubCategories.map((subcat) => (
                        <div style={styles.filterOption} key={subcat.Id}>
                          <label>
                            <input
                              name="subcategory"
                              value={subcat.Id}
                              type="checkbox"
                              style={styles.checkbox}
                              checked={subcategory[subcat.Id]} // Check if subcategory is selected
                              onChange={() => handleSubcategoryToggle(subcat.Id)} // Toggle on change
                            />
                            <span
                              style={{
                                ...styles.checkmark,
                                ...(subcategory[subcat.Id] ? styles.checkmarkChecked : {}),
                              }}
                            >
                              {subcategory[subcat.Id] && "✓"}
                            </span>
                            {subcat.Title.charAt(0).toUpperCase() + subcat.Title.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            )}

              <div>
                <h5 style={styles.subHeader}>Price</h5>
                {["Upto $500", "Upto $1000", "Upto $1500", "Upto $2000", "Above $2000"].map(
                  (range, index) => (
                    <div style={styles.filterOption} key={index}>
                      <label>
                        <input
                          type="radio"
                          name="price"
                          style={styles.checkbox}
                          checked={price === range}
                          onChange={() => setPrice(range)}
                        />
                        <span
                          style={{
                            ...styles.circle,
                            ...(price === range ? styles.circleChecked : {}),
                          }}
                        ></span>
                        {range}
                      </label>
                    </div>
                  )
                )}
              </div>

              <div>
                <h5 style={styles.subHeader}>Duration</h5>
                {["1 hour", "1 Day", "3 Days", "1 Week", "1 Month", "Others"].map(
                  (range, index) => (
                    <div style={styles.filterOption} key={index}>
                      <label>
                        <input
                          type="radio"
                          name="duration"
                          style={styles.checkbox}
                          checked={duration === range}
                          onChange={() => setDuration(range)}
                        />
                        <span
                          style={{
                            ...styles.circle,
                            ...(duration === range ? styles.circleChecked : {}),
                          }}
                        ></span>
                        {range}
                      </label>
                    </div>
                  )
                )}
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <button
                className="btn btn-secondary"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={handleApplyFilters}
                disabled={loading}
              >
                {loading ? "Applying..." : "Apply Filters"}
              </button>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default FilterComponent;
