import React, { useState } from 'react';
import { X, Send, Mail, MapPin, Key, WifiOff } from 'lucide-react';
import { OfflineSyncService } from '../services/offlineSync';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedOffline, setSubmittedOffline] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    service: 'Spatial & WebGL Computation',
    brief: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!OfflineSyncService.isOnline()) {
      OfflineSyncService.queueInquiry(formData);
      setSubmittedOffline(true);
      setTimeout(() => {
        setSubmittedOffline(false);
        onClose();
      }, 3500);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span className="meta-label">COMMISSION & INQUIRY</span>
            <span style={styles.headerSub}>TRANSMISSION CHANNEL · Q4/26</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose} title="Close Transmission">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={styles.body}>
          {submittedOffline ? (
            <div style={styles.successBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24' }}>
                <WifiOff size={18} />
                <span className="meta-label" style={{ color: '#FBBF24' }}>OFFLINE QUEUE PRESERVED</span>
              </div>
              <h3 style={styles.successTitle}>TRANSMISSION SAVED LOCALLY</h3>
              <p style={styles.successMsg}>
                You are currently offline. Your inquiry has been securely preserved in browser storage.
                The PWA service worker will automatically dispatch it to the atelier when connectivity returns.
              </p>
              <span className="meta-label">STATUS: PENDING RECONNECTION SYNC</span>
            </div>
          ) : submitted ? (
            <div style={styles.successBox}>
              <span className="status-dot" />
              <h3 style={styles.successTitle}>TRANSMISSION RECEIVED</h3>
              <p style={styles.successMsg}>
                Your inquiry has been logged into our atelier ledger. Our principal creative technologist will respond within 24 hours.
              </p>
              <span className="meta-label">STATUS: PENDING ARCHITECTURAL REVIEW</span>
            </div>
          ) : (
            <div style={styles.splitLayout}>
              {/* Form */}
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <label style={styles.label}>
                    <span className="meta-label">01 · YOUR NAME</span>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Helena Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={styles.input}
                    />
                  </label>
                  <label style={styles.label}>
                    <span className="meta-label">02 · DIRECT EMAIL</span>
                    <input
                      required
                      type="email"
                      placeholder="h.vance@studio.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={styles.input}
                    />
                  </label>
                </div>

                <div style={styles.formRow}>
                  <label style={styles.label}>
                    <span className="meta-label">03 · ORGANIZATION</span>
                    <input
                      type="text"
                      placeholder="Atelier / Entity Name"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      style={styles.input}
                    />
                  </label>
                  <label style={styles.label}>
                    <span className="meta-label">04 · PRIMARY INQUIRY</span>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      style={styles.select}
                    >
                      <option value="Spatial & WebGL Computation">Spatial & WebGL Computation</option>
                      <option value="BioAcoustic Systems (AuraFlora)">BioAcoustic Systems (AuraFlora)</option>
                      <option value="Brand Identity & Editorial Design">Brand Identity & Editorial Design</option>
                      <option value="Architectural Design Engineering">Architectural Design Engineering</option>
                    </select>
                  </label>
                </div>

                <label style={styles.label}>
                  <span className="meta-label">05 · PROJECT BRIEF / SCOPE</span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe project parameters, milestones, and computational requirements..."
                    value={formData.brief}
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    style={styles.textarea}
                  />
                </label>

                <button type="submit" style={styles.submitBtn}>
                  <Send size={13} />
                  <span>TRANSMIT INQUIRY</span>
                </button>
              </form>

              {/* Coordinates Sidebar */}
              <div style={styles.sidebar}>
                <div style={styles.sidebarBlock}>
                  <div style={styles.sidebarBlockHead}>
                    <MapPin size={13} color="#ECECE8" />
                    <span className="meta-label">STUDIO COORDINATES</span>
                  </div>
                  <p style={styles.sidebarText}>
                    40.7128° N, 74.0060° W<br />
                    Lower Manhattan, New York, NY
                  </p>
                </div>

                <div style={styles.sidebarBlock}>
                  <div style={styles.sidebarBlockHead}>
                    <Mail size={13} color="#ECECE8" />
                    <span className="meta-label">DIRECT DISPATCH</span>
                  </div>
                  <a href="mailto:atelier@jmr.design" style={styles.sidebarLink}>
                    atelier@jmr.design
                  </a>
                </div>

                <div style={styles.sidebarBlock}>
                  <div style={styles.sidebarBlockHead}>
                    <Key size={13} color="#ECECE8" />
                    <span className="meta-label">PGP ENCRYPTION</span>
                  </div>
                  <p style={styles.pgpCode}>
                    4B82 9FA1 08C3 D721 510A
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    overflowY: 'auto',
  },
  modalContent: {
    width: '100%',
    maxWidth: '860px',
    backgroundColor: 'var(--color-bg-primary)',
    border: '1px solid var(--color-grid-active)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '92vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  headerSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-grid-line)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    background: 'none',
  },
  body: {
    padding: '24px 20px',
  },
  splitLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  input: {
    padding: '12px 14px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-line)',
    color: '#ECECE8',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    outline: 'none',
  },
  select: {
    padding: '12px 14px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-line)',
    color: '#ECECE8',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    outline: 'none',
  },
  textarea: {
    padding: '12px 14px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-line)',
    color: '#ECECE8',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    outline: 'none',
    resize: 'vertical',
  },
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    backgroundColor: '#ECECE8',
    color: '#1A1A1A',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    marginTop: '6px',
    minHeight: '44px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    paddingTop: '8px',
  },
  sidebarBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sidebarBlockHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sidebarText: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  sidebarLink: {
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: '#ECECE8',
    textDecoration: 'underline',
  },
  pgpCode: {
    fontSize: '11px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-muted)',
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
    padding: '40px 20px',
  },
  successTitle: {
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: '#FFFFFF',
  },
  successMsg: {
    fontSize: '14px',
    color: 'var(--color-text-secondary)',
    maxWidth: '460px',
    lineHeight: 1.5,
  },
};
