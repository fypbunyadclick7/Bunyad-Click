import React, { useState, useEffect } from 'react';
import SellerNavbar from '../../Components/sellerNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import FilterComponent from '../../Components/Seller/filters';
import Projects from '../../Components/Seller/viewProjects';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import axios from 'axios';

export default function ViewProjects() {
  const [activeTab, setActiveTab] = useState('bestMatches');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: {}, price: null }); // Filters state

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job/getSellerJobs`, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        });
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  // Apply filters and search query
  useEffect(() => {
    const applyFilters = () => {
      if (!jobs || jobs.length === 0) {
        setFilteredJobs([]);
        return;
      }
  
      const { category, price } = filters; // Destructure filters state
  
      const filtered = jobs.filter((job) => {
        // Handle cases where Category might not be a string
        const jobCategory = job.Category ? job.Category.toString().toLowerCase() : '';
  
        // Check if any selected category matches the job's category
        const matchesCategory = Object.keys(category || {}).some(
          (key) => category[key] && jobCategory.includes(key.toLowerCase())
        );
  
        // Handle price filter logic
        const matchesPrice = !price || 
          (price === 'Upto $500' && job.Price <= 500) ||
          (price === 'Upto $1000' && job.Price <= 1000) ||
          (price === 'Upto $1500' && job.Price <= 1500) ||
          (price === 'Upto $2000' && job.Price <= 2000) ||
          (price === 'Above $2000' && job.Price > 2000);
  
        return matchesCategory && matchesPrice;
      });
      setFilteredJobs(filtered);
    };
  
    applyFilters();
  }, [filters, searchQuery, jobs]);
  

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());
  const handleTabClick = (tab) => setActiveTab(tab);
  const handleApplyFilters = (newFilters) => setFilters(newFilters);

  return (
    <div>
      <SellerNavbar />
      <div className="container">
        <div className="row">
          <div className="col-md-4 sm-12">
            <FilterComponent onApplyFilters={handleApplyFilters} />
          </div>
          <div className="col-md-8 sm-12">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Find Jobs Here</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, position: 'relative' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ position: 'absolute', left: '10px', color: '#aaa' }} />
                <input
                  id="search"
                  name="search"
                  type="text"
                  required
                  className="custom-input block w-full"
                  placeholder="Search jobs"
                  style={{
                    width: '100%',
                    padding: '10px 40px',
                    borderRadius: '25px',
                    outline: 'none',
                  }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="container">
              <MDBTabs className="mt-4">
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleTabClick('bestMatches')} active={activeTab === 'bestMatches'}>
                    Best Matches
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleTabClick('mostRecent')} active={activeTab === 'mostRecent'}>
                    Most Recent
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleTabClick('savedJobs')} active={activeTab === 'savedJobs'}>
                    Saved Jobs
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>

              <MDBTabsContent>
                <MDBTabsPane show={activeTab === 'bestMatches'}>
                  <div className="container py-4">
                    <Projects jobs={filteredJobs} />
                  </div>
                </MDBTabsPane>

                <MDBTabsPane show={activeTab === 'mostRecent'}>
                  <div className="container py-4">
                    <Projects jobs={filteredJobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))} />
                  </div>
                </MDBTabsPane>

                <MDBTabsPane show={activeTab === 'savedJobs'}>
                  <div className="container py-4">
                    <p>No saved jobs available.</p>
                  </div>
                </MDBTabsPane>
              </MDBTabsContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
