import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import BuyerNavbar from '../../Components/buyernavbar';
import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import RecentProjects from '../../Components/Buyer/recentProject';
import Project from '../../Components/Buyer/project';

export default function ViewProjects() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('recent'); 
  const [searchQuery, setSearchQuery] = useState('');

  const handlePostJobClick = () => {
    history.push('/buyerpostJob');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <BuyerNavbar />
      <div className='container'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>All job posts</h1>
          <button
            onClick={handlePostJobClick}
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            style={{
              padding: '10px 20px',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
            Post a new job
          </button>
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
              placeholder="Search job postings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px',
                borderRadius: '25px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>
      <div className="container">
        <MDBTabs className="mt-4">
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('recent')}
              active={activeTab === 'recent'}
            >
              Recent
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('assigned')}
              active={activeTab === 'assigned'}
            >
              Assigned
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('completed')}
              active={activeTab === 'completed'}
            >
              Completed
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('cancelled')}
              active={activeTab === 'cancelled'}
            >
              Cancelled
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('disputed')}
              active={activeTab === 'disputed'}
            >
              Disputed
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
      </div>

      <MDBTabsContent>
        <MDBTabsPane show={activeTab === 'recent'}>
          <div className="container py-4">
            <RecentProjects searchQuery={searchQuery} />
          </div>
        </MDBTabsPane>

        <MDBTabsPane show={activeTab === 'assigned'}>
          <div className="container py-4">
            <Project searchQuery={searchQuery} />
          </div>
        </MDBTabsPane>

        <MDBTabsPane show={activeTab === 'completed'}>
          <div className="container py-4">
            <Project searchQuery={searchQuery} />
          </div>
        </MDBTabsPane>

        <MDBTabsPane show={activeTab === 'cancelled'}>
          <div className="container py-4">
            <Project searchQuery={searchQuery} />
          </div>
        </MDBTabsPane>

        <MDBTabsPane show={activeTab === 'disputed'}>
          <div className="container py-4">
            <Project searchQuery={searchQuery} />
          </div>
        </MDBTabsPane>
      </MDBTabsContent>
    </div>
  );
}
