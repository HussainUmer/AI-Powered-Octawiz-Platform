import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Placeholder for Supabase Client

export default function Dashboard() {
  const [onboardingRecords, setOnboardingRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  // Fetch user ID from localStorage and onboarding data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')); // Assuming user is stored as JSON
    console.log('Stored User:', storedUser);
    if (storedUser && storedUser.user_id) {
      setUserId(storedUser.user_id);
      setUsername(storedUser.first_name || 'User'); // Set username if available
      fetchOnboardingData(storedUser.user_id);
    } else {
      console.error('No user found in localStorage');
      // Optionally redirect to login
      window.location.href = '/pages/userlogin/signin';
    }
  }, []);

  // Fetch onboarding data based on user_id or shareholder_id
  const fetchOnboardingData = async (userId) => {
    try {
      // Fetch onboarding records where user_id matches
      const { data: userOnboardings, error: userError } = await supabase
        .from('Onboarding')
        .select(`
            id,
            user_id,
            trade_name,
            office_type,
            visa_requirement,
            submitted,
            custom_activity,
            visa_approved,
            license_approved,
            tradename_approved,
            Industry(name),
            Activities(name),
            Freezones(name),
            Owner_structure(struture_name)
          `)
        .eq('user_id', userId);

      if (userError) throw userError;
      console.log('User Onboardings:', userOnboardings);
      // Fetch onboarding records where shareholder_id matches
      const { data: shareholderOnboardings, error: shareholderError } = await supabase
        .from('Shareholder')
        .select(`
          onboarding_id,
          Onboarding(
            id,
            user_id,
            trade_name,
            office_type,
            visa_requirement,
            submitted,
            custom_activity,
            Industry(name),
            Activities(name),
            Freezones(name),
            Owner_structure(struture_name)
          )
        `)
        .eq('shareholder_id', userId); // Assuming shareholder_id is stored in localStorage if the user is a shareholder

      if (shareholderError) throw shareholderError;
      console.log('Shareholder Onboardings:', shareholderOnboardings);
      // Combine and deduplicate onboarding records
      const combinedOnboardings = [
        ...(userOnboardings || []),
        ...(shareholderOnboardings || []).map((s) => s.Onboarding),
      ].filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      );

      console.log('Combined Onboardings:', combinedOnboardings);
      setOnboardingRecords(combinedOnboardings);

      // Fetch documents for all onboarding records
      const onboardingIds = combinedOnboardings.map((record) => record.id);
      if (onboardingIds.length > 0) {
        fetchDocumentsData(onboardingIds);
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    }
  };

  // Fetch documents data for multiple onboarding IDs
  const fetchDocumentsData = async (onboardingIds) => {
    try {
      const { data, error } = await supabase
        .from('Documents')
        .select(`
          *,
          Shareholder(name)
        `)
        .in('onboarding_id', onboardingIds);

      if (error) throw error;
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents data:', error);
    }
  };

  // Calculate progress based on completed fields in onboarding and documents
  useEffect(() => {
    // Define required fields for onboarding progress
    const requiredFields = [
      'trade_name',
      'office_type',
      'visa_requirement',
      'submitted',
      'custom_activity',
      'visa_approved',
      'license_approved',
      'tradename_approved'
    ];
    let filledFields = 0;
    let totalFields = onboardingRecords.length * requiredFields.length;
    // Count only required fields
    onboardingRecords.forEach((record) => {
      requiredFields.forEach((field) => {
        if (record[field] !== null && record[field] !== undefined && record[field] !== '') {
          filledFields++;
        }
      });
    });
    // Optionally count uploaded documents as part of progress
    let docFields = 0;
    documents.forEach((doc) => {
      if (doc.status === 'uploaded') {
        docFields++;
      }
    });
    // Add document fields to total if you want them to count
    const total = totalFields + documents.length;
    const percent = total > 0 ? Math.round(((filledFields + docFields) / total) * 100) : 0;
    setProgress(percent > 100 ? 100 : percent);
  }, [onboardingRecords, documents]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  return (
    <div className="dashboard bg-dark text-white position-relative">
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="container">
          {/* Header Section */}
          <header className="dashboard-header d-flex justify-content-between align-items-center mb-4">
            <h2 className="title">Welcome to Your Dashboard, {username}</h2>
            <div className="profile-icon">
              {/* <span className="icon" style={{ fontSize: '30px' }}>
                👤
              </span> */}
              <div className="w-100 d-flex justify-content-center">
                  <button className="btn btn-outline-danger px-5 py-2" onClick={handleLogout}>
                      Logout
              </button>
          </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="row g-4">
            {/* Progress Tracker Section */}
            <div className="col-md-6">
              <div className="card-box dashboard-progress-tracker">
                <div className="d-flex align-items-center mb-3">
                  <span className="icon">🚀</span>
                  <h5 className="mb-0">Progress Tracker</h5>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{ width: `${progress}%` }}>
                    {progress}% Complete
                  </div>
                </div>
              </div>
            </div>

            {/* Document Vault Section */}
            <div className="col-md-6">
              <div className="card-box dashboard-document-vault">
                <div className="d-flex align-items-center mb-3">
                  <span className="icon">🗂️</span>
                  <h5 className="mb-0">Document Vault</h5>
                </div>
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                  {documents.map((doc) => (
                    <div className="vault-item" key={doc.id}>
                      <div className="vault-icon">📄</div>
                      <div>{doc.type}</div>
                      <div>Shareholder: {doc.Shareholder?.name || 'N/A'}</div>
                      <div>Onboarding ID: {doc.onboarding_id}</div>
                      {doc.status === 'uploaded' ? (
                        <button className="btn btn-sm btn-outline-light">Download</button>
                      ) : (
                        <button className="btn btn-sm btn-outline-warning">Upload</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Timeline Section */}
            <div className="col-md-6">
              <div className="card-box dashboard-timeline mt-4">
                <div className="d-flex align-items-center mb-3">
                  <span className="icon">⏳</span>
                  <h5 className="mb-0">Application Timeline</h5>
                </div>
                {/* Approval Status Badges */}
                {onboardingRecords.length > 0 && (
                  <div className="mt-3">
                    {onboardingRecords.map((onboardingData) => (
                      <div key={onboardingData.id} className="mb-2">
                        <span className={`badge me-2 ${onboardingData.visa_approved ? 'bg-success' : 'bg-secondary'}`}>
                          Visa {onboardingData.visa_approved ? 'Approved' : 'Pending'}
                        </span>
                        <span className={`badge me-2 ${onboardingData.license_approved ? 'bg-success' : 'bg-secondary'}`}>
                          License {onboardingData.license_approved ? 'Approved' : 'Pending'}
                        </span>
                        <span className={`badge me-2 ${onboardingData.tradename_approved ? 'bg-success' : 'bg-secondary'}`}>
                          Trade Name {onboardingData.tradename_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Onboarding Information Section */}
          {onboardingRecords.length > 0 ? (
            onboardingRecords.map((onboardingData) => (
              <div className="dashboard-onboarding-info mt-4" key={onboardingData.id}>
                <h5>Onboarding Information (ID: {onboardingData.id})</h5>
                <div className="info-item">
                  <span>Industry:</span>{' '}
                  <strong>{onboardingData.Industry?.name || 'Not Provided'}</strong>
                  <button className="btn btn-sm btn-outline-info ms-2">Edit</button>
                </div>
                <div className="info-item">
                  <span>Activity:</span>{' '}
                  <strong>{onboardingData.Activities?.name || onboardingData.custom_activity || 'Not Provided'}</strong>
                  <button className="btn btn-sm btn-outline-info ms-2">Edit</button>
                </div>
                <div className="info-item">
                  <span>Visa Requirement:</span>{' '}
                  <strong>{onboardingData.visa_requirement || 'Not Provided'}</strong>
                  <button className="btn btn-sm btn-outline-info ms-2">Edit</button>
                </div>
                <div className="info-item">
                  <span>Office Type:</span>{' '}
                  <strong>{onboardingData.office_type || 'Not Provided'}</strong>
                  <button className="btn btn-sm btn-outline-info ms-2">Edit</button>
                </div>
                <div className="info-item">
                  <span>Ownership:</span>{' '}
                  <strong>{onboardingData.Owner_structure?.struture_name || 'Not Provided'}</strong>
                  <button className="btn btn-sm btn-outline-info ms-2">Edit</button>
                </div>
                <div className="info-item">
                  <span>Freezone:</span>{' '}
                  <strong>{onboardingData.Freezones?.name || 'Not Provided'}</strong>
                  <button className="btn btn-sm btn-outline-info ms-2">Edit</button>
                </div>
                <div className="info-item">
                  <span>Trade Name:</span>{' '}
                  <strong>{onboardingData.trade_name || 'Not Provided'}</strong>
                  <button className="btn btn-sm btn-outline-info ms-2">Edit</button>
                </div>
              </div>
            ))
          ) : (
            <div className="dashboard-onboarding-info mt-4">
              <h5>No Onboarding Information Available</h5>
            </div>
          )}

          {/* Logout Button */}
          {/* <div className="w-100 d-flex justify-content-center mt-5">
            <button className="btn btn-outline-danger px-5 py-2" onClick={handleLogout}>
              Logout
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}














// import React from 'react';

// export default function Dashboard() {
//   // Redirect to signin page on logout
//   const handleLogout = () => {
//     window.location.href = '/pages/userlogin/signin';
//   };

//   return (
//     <div className="dashboard bg-dark text-white position-relative min-vh-100" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }}>
//       <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ minHeight: '100vh' }}>
//         <div className="container">
//           <div className="glass-card p-5 mx-auto" style={{
//             width: '100%',
//             maxWidth: 950,
//             borderRadius: 24,
//             background: 'rgba(30, 34, 44, 0.85)',
//             boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(255,255,255,0.08)'
//           }}>
//             <h2 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 900, letterSpacing: 1, fontSize: '2.2rem', textShadow: '0 2px 12px #000' }}>Welcome to Your Dashboard</h2>
//             <div className="row g-4">
//               {/* Progress Tracker */}
//               <div className="col-md-6">
//                 <div className="p-4 rounded-4 shadow-sm h-100" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
//                   <div className="d-flex align-items-center mb-3">
//                     <span style={{ fontSize: 28, marginRight: 12 }}>🚀</span>
//                     <h5 className="mb-0" style={{ color: '#fff', fontWeight: 600 }}>Progress Tracker</h5>
//                   </div>
//                   <div className="progress" style={{ height: 22, background: '#23272f' }}>
//                     <div className="progress-bar bg-success" style={{ width: '70%', fontWeight: 600, color: '#fff', fontSize: 16 }}>
//                       70% Complete
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Document Vault */}
//               <div className="col-md-6">
//                 <div className="p-4 rounded-4 shadow-sm h-100" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
//                   <div className="d-flex align-items-center mb-3">
//                     <span style={{ fontSize: 28, marginRight: 12 }}>🗂️</span>
//                     <h5 className="mb-0" style={{ color: '#fff', fontWeight: 600 }}>Document Vault</h5>
//                   </div>
//                   <div className="d-flex gap-3 flex-wrap justify-content-center">
//                     <div className="vault-item bg-secondary bg-opacity-10 p-3 rounded-3 text-center" style={{ minWidth: 110, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
//                       <div className="mb-2" style={{ fontSize: 22 }}>📄</div>
//                       <div style={{ fontWeight: 500 }}>Passport</div>
//                       <button className="btn btn-sm btn-outline-light mt-2">Download</button>
//                     </div>
//                     <div className="vault-item bg-secondary bg-opacity-10 p-3 rounded-3 text-center" style={{ minWidth: 110, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
//                       <div className="mb-2" style={{ fontSize: 22 }}>📜</div>
//                       <div style={{ fontWeight: 500 }}>MoA</div>
//                       <button className="btn btn-sm btn-outline-light mt-2">Download</button>
//                     </div>
//                     <div className="vault-item bg-secondary bg-opacity-10 p-3 rounded-3 text-center" style={{ minWidth: 110, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
//                       <div className="mb-2" style={{ fontSize: 22 }}>🏷️</div>
//                       <div style={{ fontWeight: 500 }}>License</div>
//                       <button className="btn btn-sm btn-outline-light mt-2">Download</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* Application Timeline */}
//               <div className="col-md-6">
//                 <div className="p-4 rounded-4 shadow-sm h-100 mt-4" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
//                   <div className="d-flex align-items-center mb-3">
//                     <span style={{ fontSize: 28, marginRight: 12 }}>⏳</span>
//                     <h5 className="mb-0" style={{ color: '#fff', fontWeight: 600 }}>Application Timeline</h5>
//                   </div>
//                   <ul className="timeline list-unstyled ps-0" style={{ color: '#fff', fontSize: 16 }}>
//                     <li className="mb-2"><span className="badge bg-success me-2">✔</span>Name Approval</li>
//                     <li className="mb-2"><span className="badge bg-warning text-dark me-2">⏳</span>License Ready</li>
//                   </ul>
//                 </div>
//               </div>
//               {/* Chatbot Widget & Actions */}
//               <div className="col-md-6">
//                 <div className="p-4 rounded-4 shadow-sm h-100 mt-4 d-flex flex-column align-items-center justify-content-between" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
//                   <div className="w-100 mb-3">
//                     <div className="d-flex align-items-center mb-2">
//                       <span style={{ fontSize: 24, marginRight: 10 }}>💬</span>
//                       <span style={{ fontWeight: 600, color: '#fff', fontSize: 18 }}>AI Chatbot</span>
//                     </div>
//                     <div className="mb-2" style={{ fontSize: '0.98rem', color: '#fff' }}>
//                       How can I help you today?
//                     </div>
//                     <input type="text" className="form-control form-control-sm mb-2" placeholder="Type your message..." style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }} />
//                     <button className="btn btn-sm btn-success w-100">Send</button>
//                   </div>
//                   <div className="w-100 d-flex gap-3 justify-content-center mt-3">
//                     <button className="btn btn-outline-light">Upload Docs</button>
//                     <button className="btn btn-outline-info">Chat with Support</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Logout button at the end, centered */}
//             <div className="w-100 d-flex justify-content-center mt-5">
//               <button
//                 className="btn btn-outline-danger px-5 py-2"
//                 style={{ fontSize: '1.1rem', fontWeight: 600 }}
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
