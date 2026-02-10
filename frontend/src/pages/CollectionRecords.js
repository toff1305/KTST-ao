import React, { useState } from 'react';
import { HiDownload, HiSearch } from 'react-icons/hi';

const CollectionRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data based on Page 11 of the UI
  const records = [
    { id: 1, client: "Client Name", date: "18 January 2026 || 12:00 PM", amount: "1,200.00" },
    { id: 2, client: "Client Name", date: "18 January 2026 || 12:00 PM", amount: "1,200.00" },
    { id: 3, client: "Client Name", date: "18 January 2026 || 12:00 PM", amount: "1,200.00" },
    { id: 4, client: "Client Name", date: "18 January 2026 || 12:00 PM", amount: "1,200.00" },
    { id: 5, client: "Client Name", date: "18 January 2026 || 12:00 PM", amount: "1,200.00" },
    { id: 6, client: "Client Name", date: "18 January 2026 || 12:00 PM", amount: "1,200.00" },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Collection Records</h3>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <HiSearch style={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search for Records..." 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Download Button */}
      <button style={styles.downloadBtn}>
        <HiDownload size={20} />
        <span>Download Daily Collection Summary</span>
      </button>

      <h4 style={styles.sectionTitle}>Recent Collections</h4>

      {/* Records List */}
      <div style={styles.listContainer}>
        {records.map((record) => (
          <div key={record.id} style={styles.card}>
            <div>
              <p style={styles.recordText}>Collected Payment from {record.client}</p>
              <p style={styles.recordDate}>{record.date}</p>
            </div>
            <span style={styles.amount}>+ P {record.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', paddingBottom: '80px' }, // Extra padding for navbar
  title: { color: '#1a237e', margin: '0 0 15px 0' },
  searchContainer: { position: 'relative', marginBottom: '15px' },
  searchIcon: { position: 'absolute', left: '10px', top: '12px', color: '#888' },
  searchInput: { width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #ccc' },
  downloadBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', backgroundColor: '#fff', border: '1px solid #1a237e', color: '#1a237e', borderRadius: '8px', fontWeight: 'bold', marginBottom: '20px', cursor: 'pointer' },
  sectionTitle: { fontSize: '0.9rem', color: '#555', marginBottom: '10px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  recordText: { margin: 0, fontSize: '0.9rem', fontWeight: '500', color: '#333' },
  recordDate: { margin: '4px 0 0 0', fontSize: '0.75rem', color: '#888' },
  amount: { color: '#2e7d32', fontWeight: 'bold', fontSize: '0.95rem' }
};

export default CollectionRecords;