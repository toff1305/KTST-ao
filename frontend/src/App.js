import React, { useState } from 'react';
import { HiHome, HiUsers, HiCalendar, HiDocumentText, HiUserCircle } from 'react-icons/hi';
import mapIcon from './components/map-icon.png';

// RESOLVED CASING: Fixed imports to match PascalCase strictly for compilation
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientMap from './pages/ClientMap';
import Schedule from './pages/Schedule';
import CollectionRecords from './pages/CollectionRecords';

import 'leaflet/dist/leaflet.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Authentication Guard
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // Navigation Logic
  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'clients': return <ClientList />;
      case 'map': return <ClientMap />; 
      case 'schedule': return <Schedule />;
      case 'records': return <CollectionRecords />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container" style={styles.appWrapper}>
      
      {/* HEADER BLOCK - Deep Navy theme with a defined gap from the content */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.aoInfo}>
            <h2 style={styles.officerName}>Account Officer Name</h2>
            <p style={styles.dateTime}>Jan. 22, 2026 || 12:00 PM</p>
          </div>
          <div style={{ position: 'relative' }}>
            <div 
              style={styles.profileCircle}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <HiUserCircle size={32} color="#000" />
            </div>
            
            {showProfileMenu && (
              <div style={styles.profileDropdown}>
                <div style={styles.dropdownItem}>My Profile</div>
                <div style={styles.dropdownItem} onClick={() => setIsLoggedIn(false)}>
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT AREA - flex: 1 ensures it fills the space without overlapping the header */}
      <main style={styles.mainContent}>
        <div style={styles.pageArea}>
          {renderContent()}
        </div>
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav style={styles.navbar}>
        <div onClick={() => setActiveTab('home')} style={styles.navItem}>
          <HiHome size={26} color={activeTab === 'home' ? '#00e5ff' : '#fff'} />
        </div>
        <div onClick={() => setActiveTab('clients')} style={styles.navItem}>
          <HiUsers size={26} color={activeTab === 'clients' ? '#00e5ff' : '#fff'} />
        </div>
        
        <div style={styles.mapButtonContainer} onClick={() => setActiveTab('map')}>
          <div style={styles.mapButtonCircle}>
             <img src={mapIcon} alt="Map" style={styles.mapIconImg} />
          </div>
        </div>

        <div onClick={() => setActiveTab('schedule')} style={styles.navItem}>
          <HiCalendar size={26} color={activeTab === 'schedule' ? '#00e5ff' : '#fff'} />
        </div>
        <div onClick={() => setActiveTab('records')} style={styles.navItem}>
          <HiDocumentText size={26} color={activeTab === 'records' ? '#00e5ff' : '#fff'} />
        </div>
      </nav>
    </div>
  );
}

const styles = {
  appWrapper: { 
    width: '100%',
    maxWidth: '500px', 
    margin: '0 auto', 
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    position: 'relative', 
    backgroundColor: '#fff', 
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden', // Prevents body scroll
    boxShadow: '0 0 25px rgba(0,0,0,0.1)'
  },
  // Responsive dark header with a bottom margin gap
  header: { 
    width: '100%',
    padding: '16px 20px', 
    backgroundColor: '#0c0c3a', 
    color: '#fff',
    flexShrink: 0,
    zIndex: 100,
    marginBottom: '15px' // GAP: Prevents overlap with content below
  },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  aoInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  officerName: { margin: 0, fontSize: '1.1rem', fontWeight: '900', letterSpacing: '0.5px' },
  dateTime: { margin: 0, fontSize: '0.75rem', opacity: 0.8, fontStyle: 'italic' },
  profileCircle: {
    width: '38px',
    height: '38px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid #fff',
    float: 'left',
    marginRight: '5vh' 
  },
  profileDropdown: { 
    position: 'absolute', top: '45px', right: 0, 
    backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', 
    borderRadius: '8px', zIndex: 1000, minWidth: '130px', 
    overflow: 'hidden', border: '2px solid #000' 
  },
  dropdownItem: { padding: '12px 15px', fontSize: '0.9rem', color: '#000', fontWeight: 'bold', borderBottom: '1px solid #eee', cursor: 'pointer' },
  mainContent: { 
    flex: 1, 
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Contains content within flexbox limits
    width: '100%'
  },
  pageArea: {
    flex: 1,
    overflowY: 'auto', // Allows internal page scrolling
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  },
  navbar: { 
    height: '75px', 
    backgroundColor: '#0c0c3a', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 20px', 
    position: 'relative', 
    width: '100%', 
    borderTopLeftRadius: '20px', 
    borderTopRightRadius: '20px', 
    boxSizing: 'border-box',
    zIndex: 3000,
    marginTop: 'auto' // Sticks to bottom of container
  },
  navItem: { cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px' },
  mapButtonContainer: { position: 'relative', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', cursor: 'pointer' },
  mapButtonCircle: { 
    position: 'absolute', 
    bottom: '15px', 
    width: '75px', 
    height: '75px', 
    backgroundColor: '#fff', 
    borderRadius: '50%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    boxShadow: '0 -4px 10px rgba(0,0,0,0.2)', 
    border: '5px solid #fff' 
  },
  mapIconImg: { width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }
};

export default App;