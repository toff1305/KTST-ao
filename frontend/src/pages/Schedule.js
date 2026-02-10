import React, { useState } from 'react';

const Schedule = () => {
  const [selectedClient, setSelectedClient] = useState(null); // State to track which client to pay
  const [schedule, setSchedule] = useState([
    { id: 1, name: "Cruz, Kristine Marie X.", area: "San Antonio", amount: "2,000.00", status: "Unpaid" },
    { id: 2, name: "Del Aura, Lola B.", area: "Cabiao", amount: "2,000.00", status: "Paid" }
  ]);

  const handleConfirm = () => {
    // Logic to update the status in the frontend
    setSchedule(prev => prev.map(c => 
      c.id === selectedClient.id ? { ...c, status: "Paid" } : c
    ));
    setSelectedClient(null); // Close modal
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h3 style={{ color: '#1a237e' }}>Today's Collection Schedule</h3>
      
      {schedule.map((item) => (
        <div key={item.id} style={styles.card}>
          <div>
            <p style={{ fontWeight: 'bold', margin: 0 }}>{item.name}</p>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{item.area}</p>
            <p style={{ fontWeight: 'bold', color: '#1a237e' }}>PHP {item.amount}</p>
          </div>
          {item.status === "Unpaid" ? (
            <button onClick={() => setSelectedClient(item)} style={styles.btnMark}>
              MARK AS PAID
            </button>
          ) : (
            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>PAID</span>
          )}
        </div>
      ))}

      {/* CONFIRMATION MODAL (Reflects UI Page 10) */}
      {selectedClient && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={() => setSelectedClient(null)} style={styles.closeX}>X</button>
            <p style={styles.modalText}>Mark Ms. {selectedClient.name} as Paid?</p>
            
            <div style={styles.uploadBox}>
              <span>📷 Upload Proof of Payment</span>
            </div>

            <button onClick={handleConfirm} style={styles.confirmBtn}>CONFIRM</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  btnMark: { backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '80%', maxWidth: '350px', textAlign: 'center', position: 'relative' },
  closeX: { position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'none', fontSize: '1.2rem', color: 'red', cursor: 'pointer' },
  modalText: { fontWeight: 'bold', color: '#1a237e', marginBottom: '20px' },
  uploadBox: { border: '2px dashed #ccc', padding: '15px', borderRadius: '10px', color: '#666', marginBottom: '20px', cursor: 'pointer' },
  confirmBtn: { width: '100%', padding: '12px', backgroundColor: '#7cb342', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Schedule;