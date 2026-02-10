import React from 'react';
import { HiRefresh, HiChevronDoubleUp, HiChevronRight } from 'react-icons/hi';
import { FaWallet } from 'react-icons/fa'; // Assuming react-icons/fa is available, if not use Hi equivalent

const Dashboard = () => {
  return (
    <div style={styles.container}>
      
      {/* QUOTA CARD */}
      <div style={styles.quotaCard}>
        <div style={styles.quotaHeader}>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Monthly Quota</span>
          {/* <span style={{ fontSize: '1.5rem' }}>...</span> */}
        </div>
        <div style={styles.quotaValues}>
          <span style={styles.currentQuota}>P 12,345.00</span>
          <span style={styles.targetQuota}> / p15,000.00</span>
        </div>
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}></div>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>Client Cluster</h3>

      {/* CLUSTER STATS */}
      <div style={styles.clusterGrid}>
        {/* Card 1: Finished */}
        <div style={styles.statCard}>
          <div style={styles.iconContainer}>
            <HiRefresh size={24} color="#333" />
          </div>
          <div style={styles.statNumberBlue}>
            37<span style={styles.statTotal}>/50</span>
          </div>
          <p style={styles.statLabel}>Finished<br/>Transactions</p>
          <div style={styles.seeAllLink}>See All &gt;</div>
        </div>

        {/* Card 2: Paid */}
        <div style={styles.statCard}>
          <div style={styles.iconContainer}>
            <FaWallet size={24} color="#333" />
          </div>
          <div style={styles.statNumberGreen}>37</div>
          <p style={styles.statLabel}>Paid<br/>Clients</p>
          <div style={styles.seeAllLink}>See All &gt;</div>
        </div>

        {/* Card 3: Unpaid */}
        <div style={styles.statCard}>
          <div style={styles.iconContainer}>
            <FaWallet size={24} color="#333" /> 
            {/* You might want to overlay a clock icon here strictly to match image */}
          </div>
          <div style={styles.statNumberRed}>13</div>
          <p style={styles.statLabel}>Unpaid<br/>Clients</p>
          <div style={styles.seeAllLink}>See All &gt;</div>
        </div>
      </div>

      <div style={styles.sectionHeaderRow}>
        <h3 style={styles.sectionTitle}>Recent Collections</h3>
        <span style={styles.headerSeeAll}>See All &gt;</span>
      </div>

      {/* RECENT COLLECTIONS LIST */}
      <div style={styles.collectionList}>
        {[1, 2, 3, 4].map((item, i) => (
          <div key={i} style={styles.collectionItem}>
            <div style={styles.collectionIconBox}>
              <HiChevronDoubleUp size={20} color="#000" />
            </div>
            <div style={styles.collectionInfo}>
              <p style={styles.cName}>Collected Payment from Client Name</p>
              <p style={styles.cDate}>18 January 2026 || 12:00 PM</p>
            </div>
            <div style={styles.cAmount}>+ P 1,200.00</div>
          </div>
        ))}
      </div>

    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  
  // Quota Card
  quotaCard: {
    background: 'linear-gradient(135deg, #1a237e 0%, #42a5f5 100%)',
    borderRadius: '15px',
    padding: '20px',
    color: '#fff',
    marginBottom: '25px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },
  quotaValues: { margin: '10px 0 15px 0' },
  currentQuota: { fontSize: '1.8rem', fontWeight: 'bold' },
  targetQuota: { fontSize: '0.9rem', opacity: 0.8 },
  progressContainer: {
    height: '8px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBar: {
    width: '82%', // 12345/15000 approx
    height: '100%',
    backgroundColor: '#fdd835' // Yellow/Gold
  },

  sectionTitle: { color: '#1a237e', margin: '0 0 15px 0', fontSize: '1.1rem' },
  sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  headerSeeAll: { fontSize: '0.8rem', color: '#1a237e', cursor: 'pointer', fontStyle: 'italic' },

  // Cluster Grid
  clusterGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '25px' },
  statCard: {
    backgroundColor: '#f5f5f5', // Light grey bg
    borderRadius: '15px',
    padding: '15px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative'
  },
  iconContainer: { marginBottom: '5px' },
  statNumberBlue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#1a237e', lineHeight: 1 },
  statNumberGreen: { fontSize: '1.8rem', fontWeight: 'bold', color: '#4CAF50', lineHeight: 1 },
  statNumberRed: { fontSize: '1.8rem', fontWeight: 'bold', color: '#f44336', lineHeight: 1 },
  statTotal: { fontSize: '0.9rem', color: '#1a237e' },
  statLabel: { fontSize: '0.7rem', color: '#1a237e', fontWeight: 'bold', margin: '5px 0 15px 0', lineHeight: 1.2 },
  seeAllLink: { position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.6rem', color: '#1a237e', fontStyle: 'italic' },

  // Collections
  collectionList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  collectionItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '12px',
    borderBottom: '1px solid #e0e0e0'
  },
  collectionIconBox: { marginRight: '10px' },
  collectionInfo: { flex: 1 },
  cName: { margin: 0, fontSize: '0.8rem', fontWeight: 'bold', color: '#1a237e' },
  cDate: { margin: 0, fontSize: '0.7rem', color: '#555', fontStyle: 'italic' },
  cAmount: { color: '#4CAF50', fontWeight: 'bold', fontSize: '0.85rem' }
};

export default Dashboard;