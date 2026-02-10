import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HiCheck, HiLocationMarker, HiX, HiChevronDown, HiChevronUp, HiCalendar, HiCash, HiExclamationCircle } from 'react-icons/hi';

const ClientMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({}); 
  
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pipelineFilter, setPipelineFilter] = useState('ALL'); 

  // DATASET: Account Officer Hierarchy (Client -> Loans -> Parts)
  const [clients, setClients] = useState([
    { 
      id: "C-10024", 
      name: "ROBERTO S. DIMAGUIBA", 
      pos: [15.3070, 120.9080], 
      address: "Brgy. Malapit, San Isidro",
      reliability: 20,
      loans: [
        {
          id: 'LN-A01', type: "Personal", balance: 2400,
          collections: [
            { id: 101, part: 1, date: "2026-01-28", amount: 1200, status: "Paid" },
            { id: 102, part: 2, date: "2026-02-04", amount: 1200, status: "Pending" }
          ]
        },
        {
          id: 'LN-A02', type: "Business", balance: 9000,
          collections: [
            { id: 201, part: 1, date: "2026-02-04", amount: 4500, status: "Overdue" },
            { id: 202, part: 2, date: "2026-03-04", amount: 4500, status: "Pending" }
          ]
        }
      ]
    },
    { 
      id: "C-10026", 
      name: "DAINSY J. FILIP", 
      pos: [15.3120, 120.9150], 
      address: "San Isidro, Nueva Ecija",
      reliability: 60,
      loans: [
        {
          id: 'LN-D12', type: "Micro Loan", balance: 1600,
          collections: [
            { id: 401, part: 1, date: "2026-01-30", amount: 800, status: "Overdue" }, 
            { id: 402, part: 2, date: "2026-02-06", amount: 800, status: "Pending" } 
          ]
        },
        {
          id: 'LN-E05', type: "Emergency Loan", balance: 1000,
          collections: [
            { id: 403, part: 1, date: "2026-02-04", amount: 1000, status: "Pending" }
          ]
        }
      ]
    },
    { 
      id: "C-10027", 
      name: "LOLA B. DEL AURA", 
      pos: [15.2890, 120.8600], 
      address: "Cabiao, Nueva Ecija",
      reliability: 100,
      loans: [
        {
          id: 'LN-P02', type: "Personal", balance: 0,
          collections: [
            { id: 501, part: 1, date: "2026-01-22", amount: 1800, status: "Paid" }
          ]
        }
      ]
    }
  ]);

  const selectedClient = useMemo(() => 
    clients.find(c => c.id === selectedClientId), [clients, selectedClientId]
  );

  // LOGIC: Calculate aggregate totals for the Overview
  const clientOverviewData = useMemo(() => {
    if (!selectedClient) return null;
    let totalOutstanding = 0;
    let totalOverdue = 0;
    let nextDate = "N/A";

    selectedClient.loans.forEach(loan => {
      loan.collections.forEach(col => {
        const s = col.status.toLowerCase();
        if (s !== 'paid') totalOutstanding += col.amount;
        if (s === 'overdue' || s === 'unpaid') totalOverdue += col.amount;
        if (s === 'pending' && (nextDate === "N/A" || new Date(col.date) < new Date(nextDate))) {
          nextDate = col.date;
        }
      });
    });

    return { totalOutstanding, totalOverdue, nextDate };
  }, [selectedClient]);

  const getClientStatuses = (client) => {
    let statuses = [];
    let hasOverdue = false;
    let hasPending = false;
    client.loans.forEach(loan => {
      loan.collections.forEach(col => {
        const s = col.status.toLowerCase();
        if (s === 'overdue' || s === 'unpaid') hasOverdue = true;
        if (s === 'pending') hasPending = true;
      });
    });
    if (hasOverdue) statuses.push({ label: 'OVERDUE', color: '#ef4444' });
    if (hasPending) statuses.push({ label: 'SCHEDULED', color: '#22c55e' });
    if (statuses.length === 0) statuses.push({ label: 'PAID', color: '#22c55e' });
    return statuses;
  };

  const handleMarkPaid = (clientId, loanId, partId) => {
    setClients(prevClients => prevClients.map(client => {
      if (client.id !== clientId) return client;
      return {
        ...client,
        loans: client.loans.map(loan => {
          if (loan.id !== loanId) return loan;
          return {
            ...loan,
            collections: loan.collections.map(col => 
              col.id === partId ? { ...col, status: 'Paid' } : col
            )
          };
        })
      };
    }));
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([15.3070, 120.9080], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    mapInstanceRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    clients.forEach(client => {
      const statusList = getClientStatuses(client);
      const pinColor = statusList.some(s => s.label === 'OVERDUE') ? '#ef4444' : '#22c55e';
      
      const icon = L.divIcon({
        html: `<div style="background-color: ${pinColor}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid black; box-shadow: 2px 2px 0px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
                 <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
               </div>`,
        className: 'custom-pin',
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -35]
      });

      const marker = L.marker(client.pos, { icon }).addTo(mapInstanceRef.current);
      
      const container = document.createElement('div');
      container.style.cssText = "text-align: center; font-family: sans-serif; padding: 5px; width: 160px; box-sizing: border-box;";
      
      const content = document.createElement('div');
      content.innerHTML = `
          <h4 style="margin: 0 0 8px 0; color: #1a237e; font-weight: 950; font-size: 0.85rem; text-transform: uppercase;">${client.name}</h4>
          <div style="margin-bottom: 6px; padding: 6px; background: #fff; border: 2px solid black; border-radius: 8px; box-shadow: 3px 3px 0px black; box-sizing: border-box;">
            <b style="font-size: 0.7rem; display: block; color: #000;">${client.loans.length} ACTIVE LOANS</b>
          </div>
      `;

      const btn = document.createElement('button');
      btn.innerText = 'VIEW DETAILS';
      btn.style.cssText = "width: 100%; padding: 8px; background: #1a237e; color: white; border: 2.5px solid black; border-radius: 8px; font-weight: 950; font-size: 0.7rem; cursor: pointer; box-shadow: 3px 3px 0px black; text-transform: uppercase;";
      btn.onclick = () => {
        setSelectedClientId(client.id);
        setIsMinimized(false);
      };
      
      container.appendChild(content);
      container.appendChild(btn);
      marker.bindPopup(container);
      markersRef.current[client.id] = marker;
    });
  }, [clients]);

  return (
    <div style={styles.container}>
      <div style={styles.mapHeader}><span style={styles.mapTitle}>NUEVA ECIJA MAP</span></div>
      
      <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
      
      {selectedClient && (
        <div style={{
          ...styles.drawerPanel,
          height: isMinimized ? '130px' : '100vh', // Responsive height with gap
          maxHeight: 'calc(100% - 80px)', // Ensures drawer doesn't overlap header
          transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={styles.drawerHandle} onClick={() => setIsMinimized(!isMinimized)}>
            <div style={styles.handleBar}></div>
          </div>

          <div style={styles.drawerContent}>
            <div style={styles.drawerHeader}>
              <div style={{ flex: 1 }}>
                <div style={styles.tagRow}>
                  <span style={styles.idTag}>#{selectedClient.id}</span>
                  {getClientStatuses(selectedClient).map((s, i) => (
                    <span key={i} style={{...styles.statusTag, backgroundColor: s.color}}>{s.label}</span>
                  ))}
                </div>
                <h2 style={styles.clientNameBig}>{selectedClient.name}</h2>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setIsMinimized(!isMinimized)} style={styles.controlBtn}>
                  {isMinimized ? <HiChevronUp size={20}/> : <HiChevronDown size={20}/>}
                </button>
                <button onClick={() => setSelectedClientId(null)} style={styles.closeBtn}>
                  <HiX size={20}/>
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div style={styles.scrollArea}>
                <button style={styles.directionsBtn}><HiLocationMarker /> GET DIRECTIONS</button>

                {/* SCALED FINANCIAL OVERVIEW */}
                <div style={styles.financialOverviewRow}>
                  <div style={styles.overviewCard}>
                    <div style={styles.overviewHeader}>
                       <HiCash size={14} /> <span>OUTSTANDING</span>
                    </div>
                    <div style={styles.overviewValue}>₱{clientOverviewData.totalOutstanding.toLocaleString()}</div>
                  </div>
                  <div style={{...styles.overviewCard, borderLeft: 'none'}}>
                    <div style={{...styles.overviewHeader, color: '#ef4444'}}>
                       <HiExclamationCircle size={14} /> <span>OVERDUE</span>
                    </div>
                    <div style={{...styles.overviewValue, color: '#ef4444'}}>₱{clientOverviewData.totalOverdue.toLocaleString()}</div>
                  </div>
                </div>

                <div style={styles.reliabilityContainer}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px'}}>
                    <span style={styles.reliabilityLabel}>RELIABILITY INDEX</span>
                    <span style={styles.reliabilityScore}>{selectedClient.reliability}%</span>
                  </div>
                  <div style={styles.progressBg}>
                    <div style={{...styles.progressFill, width:`${selectedClient.reliability}%`, backgroundColor: selectedClient.reliability < 50 ? '#ef4444' : '#22c55e'}}></div>
                  </div>
                  <p style={styles.nextDateText}>NEXT COLLECTION: <b>{clientOverviewData.nextDate}</b></p>
                </div>

                <div style={styles.pipelineFilter}>
                  <h3 style={styles.pipelineTitle}>PIPELINE</h3>
                  <div style={styles.filterTabs}>
                    {['TODAY', 'WEEK', 'ALL'].map(tab => (
                      <button 
                        key={tab} 
                        style={{...styles.filterTab, backgroundColor: pipelineFilter === tab ? '#facc15' : 'transparent'}}
                        onClick={() => setPipelineFilter(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.cardsScrollArea}>
                  {selectedClient.loans.map((loan, lIdx) => (
                    <div key={lIdx} style={styles.loanCard}>
                      <div style={styles.loanCardHeader}>
                        <span style={styles.loanTitle}><b>{loan.id}</b> | {loan.type.toUpperCase()}</span>
                        <span style={styles.activeBadge}>ACTIVE</span>
                      </div>
                      <div style={styles.collectionsContainer}>
                        {loan.collections.map((col, cIdx) => {
                          const isPaid = col.status.toLowerCase() === 'paid';
                          const isOverdue = col.status.toLowerCase() === 'overdue';
                          return (
                            <div key={cIdx} style={styles.collectionRow}>
                              <div style={{display:'flex', justifyContent:'space-between', width:'100%', marginBottom: '10px'}}>
                                <div style={{display:'flex', gap:'12px'}}>
                                  <div style={{...styles.partBox, borderColor: isPaid ? '#22c55e' : '#000', backgroundColor: isPaid ? '#dcfce7' : '#f8fafc'}}>
                                    <span style={styles.partLabel}>PART</span>
                                    <span style={styles.partNumber}>{col.part}</span>
                                  </div>
                                  <div style={styles.colInfo}>
                                    <span style={styles.amountText}>₱{col.amount.toLocaleString()}</span>
                                    <span style={styles.dateText}><HiCalendar size={14} /> {col.date}</span>
                                  </div>
                                </div>
                                <span style={{...styles.rowStatusBadge, backgroundColor: isPaid ? '#22c55e' : isOverdue ? '#ef4444' : '#fff', color: isPaid || isOverdue ? '#fff' : '#000', border: isPaid || isOverdue ? 'none' : '2px solid black'}}>
                                  {col.status.toUpperCase()}
                                </span>
                              </div>
                              
                              <div style={styles.actionRow}>
                                {!isPaid && (
                                  <button 
                                    style={styles.markPaidBtn}
                                    onClick={() => handleMarkPaid(selectedClient.id, loan.id, col.id)}
                                  >
                                    <HiCheck /> MARK PAID
                                  </button>
                                )}
                                <div style={{...styles.dateInputBox, opacity: isPaid ? 0.4 : 1}}>
                                  <input type="text" style={styles.dateInput} placeholder="mm/dd/yyyy" defaultValue={!isPaid ? col.date : ''} disabled={isPaid} />
                                  <HiCalendar size={18} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { height: '100%', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' },
  mapHeader: { position: 'absolute', top: '15px', left: '15px', zIndex: 1000, background: 'white', border: '2.5px solid black', padding: '6px 12px', borderRadius: '12px', boxShadow: '3px 3px 0px black' },
  mapTitle: { fontWeight: '950', color: '#1a237e', fontSize: '0.75rem' },
  
  drawerPanel: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#fff', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', 
    borderTop: '6px solid #2d3e75', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
    zIndex: 2000, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box'
  },
  drawerHandle: { width: '100%', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', background: '#f1f5f9', flexShrink: 0 },
  handleBar: { width: '45px', height: '6px', background: '#000', borderRadius: '3px', opacity: 0.15 },
  drawerContent: { padding: '0 15px 15px 15px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexShrink: 0 },
  tagRow: { display: 'flex', gap: '6px', marginBottom: '4px' },
  idTag: { backgroundColor: '#facc15', color: '#000', fontSize: '0.6rem', fontWeight: '900', padding: '3px 8px', borderRadius: '5px', border: '2px solid black' },
  statusTag: { color: '#fff', fontSize: '0.6rem', fontWeight: '900', padding: '3px 8px', borderRadius: '5px', border: '2px solid black' },
  clientNameBig: { margin: 0, fontSize: '1.4rem', fontWeight: '950', color: '#2d3e75', lineHeight: 1.1 },
  controlBtn: { border: '2.5px solid #000', borderRadius: '10px', background: '#f1f5f9', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  closeBtn: { border: '2.5px solid #000', borderRadius: '10px', background: '#fff', padding: '4px', cursor: 'pointer', boxShadow: '3px 3px 0px #000', display: 'flex', alignItems: 'center' },
  
  scrollArea: { flex: 1, overflowY: 'auto', paddingRight: '4px' },
  directionsBtn: { width: 'fit-content', backgroundColor: '#22c55e', color: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '10px 18px', fontWeight: '950', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', boxShadow: '4px 4px 0px #000', cursor: 'pointer', flexShrink: 0 },
  
  financialOverviewRow: { display: 'flex', border: '3px solid black', borderRadius: '12px', overflow: 'hidden', marginBottom: '15px', flexShrink: 0, boxShadow: '3px 3px 0px black' },
  overviewCard: { flex: 1, padding: '10px', backgroundColor: '#fff', borderRight: '3px solid black' },
  overviewHeader: { fontSize: '0.55rem', fontWeight: '950', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' },
  overviewValue: { fontSize: '1rem', fontWeight: '950', color: '#1a237e' },

  reliabilityContainer: { marginBottom: '20px', flexShrink: 0 },
  reliabilityLabel: { fontSize: '0.7rem', fontWeight: '900', color: '#666' },
  reliabilityScore: { fontSize: '0.85rem', fontWeight: '950', color: '#facc15' },
  progressBg: { height: '16px', width: '100%', backgroundColor: '#1f2937', borderRadius: '8px', border: '2px solid #000', overflow: 'hidden', marginTop: '2px' },
  progressFill: { height: '100%' },
  nextDateText: { margin: '6px 0 0 0', fontSize: '0.7rem', color: '#000' },

  pipelineFilter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexShrink: 0 },
  pipelineTitle: { fontSize: '0.75rem', fontWeight: '950', color: '#000' },
  filterTabs: { display: 'flex', background: '#fff', border: '2px solid black', borderRadius: '10px', padding: '3px', gap: '4px' },
  filterTab: { border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.65rem', fontWeight: '950', cursor: 'pointer' },
  
  cardsScrollArea: { flex: 1, paddingBottom: '20px', boxSizing: 'border-box' },
  loanCard: { border: '3px solid #000', borderRadius: '20px', marginBottom: '15px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)', boxSizing: 'border-box' },
  loanCardHeader: { backgroundColor: '#f1f5f9', padding: '10px 15px', borderBottom: '3px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  loanTitle: { fontSize: '0.85rem', color: '#000', fontWeight: '900' },
  activeBadge: { backgroundColor: '#2d3e75', color: '#fff', fontSize: '0.6rem', padding: '4px 10px', borderRadius: '8px', fontWeight: '950', border: '1.5px solid black' },
  
  collectionsContainer: { padding: '8px 12px', boxSizing: 'border-box' },
  collectionRow: { padding: '15px 0', borderBottom: '2px dashed #cbd5e1', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
  partBox: { width: '42px', height: '42px', border: '2.5px solid #000', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  partLabel: { fontSize: '0.45rem', fontWeight: '950', color: '#666' },
  partNumber: { fontSize: '1.1rem', fontWeight: '950', lineHeight: '1' },
  colInfo: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 },
  amountText: { fontSize: '1.2rem', fontWeight: '950', color: '#000', letterSpacing: '-0.5px' },
  dateText: { fontSize: '0.7rem', color: '#666', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' },
  rowStatusBadge: { fontSize: '0.65rem', fontWeight: '950', padding: '4px 12px', borderRadius: '8px', alignSelf: 'flex-start', flexShrink: 0 },
  
  actionRow: { display: 'flex', gap: '10px', width: '100%', marginTop: '6px' },
  markPaidBtn: { flex: 1, backgroundColor: '#fff', border: '2.5px solid #000', borderRadius: '10px', padding: '8px', fontWeight: '950', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '3px 3px 0px #000' },
  dateInputBox: { flex: 1.2, border: '2.5px solid #000', borderRadius: '10px', padding: '6px 12px', display: 'flex', alignItems: 'center', backgroundColor: '#fff', gap: '8px' },
  dateInput: { border: 'none', background: 'none', width: '100%', fontSize: '0.75rem', fontWeight: '950', outline: 'none' }
};

export default ClientMap;