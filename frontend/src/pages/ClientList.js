import React, { useState } from 'react';
import { HiSearch, HiX, HiSelector } from 'react-icons/hi';

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const clients = [
    { name: "Andres, Juan Churva J.", address: "San Isidro, Nueva Ecija", phone: "0955 123 4567", status: "Paid", type: 'green' },
    { name: "Buizon, Juan Churva J.", address: "Gapan, Nueva Ecija", phone: "0955 123 4567", status: "Unpaid", type: 'red' }, // Assuming color from list strip
    { name: "Cruz, Kristine Marie X.", address: "San Antonio, Nueva Ecija", phone: "0955 123 4567", status: "Unpaid", type: 'red' },
    { name: "Del Aura, Lola B.", address: "Cabiao, Nueva Ecija", phone: "0955 123 4567", status: "Paid", type: 'green' },
    { name: "Esophagus, Johna Y.", address: "San Isidro, Nueva Ecija", phone: "0955 123 4567", status: "No Schedule", type: 'darkblue' },
    { name: "Filip, Dainsy J.", address: "San Isidro, Nueva Ecija", phone: "0955 123 4567", status: "Paid", type: 'green' }
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedFilter === 'All' || client.address.includes(selectedFilter))
  );

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Client Cluster</h3>
      
      {/* Search Bar */}
      <div style={styles.searchWrapper}>
        <HiSearch size={20} color="#000" style={{ position: 'absolute', left: '10px' }} />
        <input 
          type="text" 
          placeholder="Search for Clients..." 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && <HiX size={20} color="#000" style={{ position: 'absolute', right: '10px', cursor: 'pointer' }} onClick={() => setSearchTerm('')} />}
      </div>

      {/* Filter Row */}
      <div style={styles.filterRow}>
        <span style={styles.listLabel}>Client List Under Your Cluster</span>
        
        <div style={styles.filterBox}>
          <div style={styles.filterTrigger} onClick={() => setShowFilter(!showFilter)}>
            <span>{selectedFilter}</span>
            <HiSelector size={16} />
          </div>
          
          {showFilter && (
            <div style={styles.dropdown}>
              {['All', 'Cabiao', 'Gapan', 'San Antonio', 'San Isidro'].map(opt => (
                <div 
                  key={opt} 
                  style={styles.dropdownItem}
                  onClick={() => { setSelectedFilter(opt); setShowFilter(false); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client List */}
      <div style={styles.list}>
        {filteredClients.map((client, i) => (
          <div key={i} style={styles.clientCard}>
            {/* Colored Strip */}
            <div style={{
              ...styles.colorStrip,
              backgroundColor: client.type === 'green' ? '#7cb342' : client.type === 'red' ? '#f44336' : '#1a237e'
            }}></div>
            
            <div style={styles.info}>
              <p style={styles.name}>{client.name}</p>
              <p style={styles.subText}>{client.address}</p>
              <p style={styles.subText}>{client.phone}</p>
            </div>
            
            <span style={{
              ...styles.statusBadge,
              backgroundColor: client.status === 'Paid' ? '#7cb342' : client.status === 'Unpaid' ? '#f44336' : '#1a237e'
            }}>
              {client.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  title: { color: '#1a237e', margin: '0 0 15px 0', textAlign: 'center' },
  
  // Search
  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '20px' },
  searchInput: {
    width: '100%',
    padding: '10px 35px',
    borderRadius: '25px', // Rounded pill shape from image
    border: '1px solid #333',
    outline: 'none',
    fontSize: '0.9rem'
  },

  // Filter
  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  listLabel: { fontSize: '0.9rem', color: '#1a237e', fontWeight: 'bold' },
  filterBox: { position: 'relative' },
  filterTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#d1c4e9', // Light purple tint from image
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    border: '1px solid #ccc'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    zIndex: 10,
    minWidth: '100px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  dropdownItem: {
    padding: '8px 10px',
    fontSize: '0.8rem',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    backgroundColor: '#fff'
  },

  // Cards
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  clientCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    overflow: 'hidden', // to crop the strip
    paddingRight: '15px',
    minHeight: '80px'
  },
  colorStrip: {
    width: '15px',
    height: '100px', // Ensure it covers height
    marginRight: '15px'
  },
  info: { flex: 1 },
  name: { margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '0.9rem', color: '#1a237e' },
  subText: { margin: 0, fontSize: '0.75rem', color: '#1a237e', fontStyle: 'italic' },
  
  statusBadge: {
    color: '#fff',
    padding: '6px 15px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    minWidth: '80px',
    textAlign: 'center'
  }
};

export default ClientList;