import React from 'react';

export default function Dashboard() {
  // Redirect to signin page on logout
  const handleLogout = () => {
    window.location.href = '/pages/userlogin/signin';
  };

  return (
    <div className="dashboard bg-dark text-white position-relative min-vh-100" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }}>
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ minHeight: '100vh' }}>
        <div className="container">
          <div className="glass-card p-5 mx-auto" style={{
            width: '100%',
            maxWidth: 950,
            borderRadius: 24,
            background: 'rgba(30, 34, 44, 0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <h2 className="mb-4 text-center" style={{ color: '#fff', fontWeight: 900, letterSpacing: 1, fontSize: '2.2rem', textShadow: '0 2px 12px #000' }}>Welcome to Your Dashboard</h2>
            <div className="row g-4">
              {/* Progress Tracker */}
              <div className="col-md-6">
                <div className="p-4 rounded-4 shadow-sm h-100" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ fontSize: 28, marginRight: 12 }}>🚀</span>
                    <h5 className="mb-0" style={{ color: '#fff', fontWeight: 600 }}>Progress Tracker</h5>
                  </div>
                  <div className="progress" style={{ height: 22, background: '#23272f' }}>
                    <div className="progress-bar bg-success" style={{ width: '70%', fontWeight: 600, color: '#fff', fontSize: 16 }}>
                      70% Complete
                    </div>
                  </div>
                </div>
              </div>
              {/* Document Vault */}
              <div className="col-md-6">
                <div className="p-4 rounded-4 shadow-sm h-100" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ fontSize: 28, marginRight: 12 }}>🗂️</span>
                    <h5 className="mb-0" style={{ color: '#fff', fontWeight: 600 }}>Document Vault</h5>
                  </div>
                  <div className="d-flex gap-3 flex-wrap justify-content-center">
                    <div className="vault-item bg-secondary bg-opacity-10 p-3 rounded-3 text-center" style={{ minWidth: 110, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
                      <div className="mb-2" style={{ fontSize: 22 }}>📄</div>
                      <div style={{ fontWeight: 500 }}>Passport</div>
                      <button className="btn btn-sm btn-outline-light mt-2">Download</button>
                    </div>
                    <div className="vault-item bg-secondary bg-opacity-10 p-3 rounded-3 text-center" style={{ minWidth: 110, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
                      <div className="mb-2" style={{ fontSize: 22 }}>📜</div>
                      <div style={{ fontWeight: 500 }}>MoA</div>
                      <button className="btn btn-sm btn-outline-light mt-2">Download</button>
                    </div>
                    <div className="vault-item bg-secondary bg-opacity-10 p-3 rounded-3 text-center" style={{ minWidth: 110, color: '#fff', boxShadow: '0 2px 8px #0002' }}>
                      <div className="mb-2" style={{ fontSize: 22 }}>🏷️</div>
                      <div style={{ fontWeight: 500 }}>License</div>
                      <button className="btn btn-sm btn-outline-light mt-2">Download</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Application Timeline */}
              <div className="col-md-6">
                <div className="p-4 rounded-4 shadow-sm h-100 mt-4" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
                  <div className="d-flex align-items-center mb-3">
                    <span style={{ fontSize: 28, marginRight: 12 }}>⏳</span>
                    <h5 className="mb-0" style={{ color: '#fff', fontWeight: 600 }}>Application Timeline</h5>
                  </div>
                  <ul className="timeline list-unstyled ps-0" style={{ color: '#fff', fontSize: 16 }}>
                    <li className="mb-2"><span className="badge bg-success me-2">✔</span>Name Approval</li>
                    <li className="mb-2"><span className="badge bg-warning text-dark me-2">⏳</span>License Ready</li>
                  </ul>
                </div>
              </div>
              {/* Chatbot Widget & Actions */}
              <div className="col-md-6">
                <div className="p-4 rounded-4 shadow-sm h-100 mt-4 d-flex flex-column align-items-center justify-content-between" style={{ background: 'rgba(36, 40, 54, 0.95)' }}>
                  <div className="w-100 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <span style={{ fontSize: 24, marginRight: 10 }}>💬</span>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: 18 }}>AI Chatbot</span>
                    </div>
                    <div className="mb-2" style={{ fontSize: '0.98rem', color: '#fff' }}>
                      How can I help you today?
                    </div>
                    <input type="text" className="form-control form-control-sm mb-2" placeholder="Type your message..." style={{ background: '#23272f', color: '#fff', border: '1px solid #444' }} />
                    <button className="btn btn-sm btn-success w-100">Send</button>
                  </div>
                  <div className="w-100 d-flex gap-3 justify-content-center mt-3">
                    <button className="btn btn-outline-light">Upload Docs</button>
                    <button className="btn btn-outline-info">Chat with Support</button>
                  </div>
                </div>
              </div>
            </div>
            {/* Logout button at the end, centered */}
            <div className="w-100 d-flex justify-content-center mt-5">
              <button
                className="btn btn-outline-danger px-5 py-2"
                style={{ fontSize: '1.1rem', fontWeight: 600 }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
