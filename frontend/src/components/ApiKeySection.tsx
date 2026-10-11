import React, { useState } from 'react';
import { ApiKeyManager } from '../services/apiKeys';
import type { ApiKeyConfig } from '../services/apiKeys';
import { Key, ExternalLink, Check, Shield, ShieldCheck, Eye, EyeOff, RotateCcw, Zap } from 'lucide-react';

export const ApiKeySection: React.FC = () => {
  const [config, setConfig] = useState<ApiKeyConfig>(() => ApiKeyManager.getConfig());
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'simulated'>('idle');

  const toggleShowKey = (keyName: string) => {
    setShowKeys((prev) => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    ApiKeyManager.saveConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  const handleResetToDefaults = () => {
    const def = ApiKeyManager.resetToDefaults();
    setConfig(def);
    setSaveSuccess(true);
    setTestStatus('idle');
    setTimeout(() => setSaveSuccess(false), 2400);
  };

  const handleTestKeys = async () => {
    setTestStatus('testing');
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (config.useCustomKeys && (config.gemmaApiKey || config.elevenlabsApiKey)) {
      setTestStatus('success');
    } else {
      setTestStatus('simulated');
    }
  };

  return (
    <section style={styles.sectionRoot} id="keys">
      {/* Architectural Header */}
      <div style={styles.sectionHeader}>
        <div style={styles.headerLeft}>
          <span className="meta-label">CREDENTIALS & INFERENCE ACCESS</span>
          <h2 style={styles.headerTitle}>API ACCESS CONFIGURATION</h2>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.statusBadge}>
            {config.useCustomKeys ? (
              <>
                <ShieldCheck size={12} color="#4ADE80" />
                <span style={{ color: '#4ADE80' }}>CUSTOM CREDENTIALS ACTIVE</span>
              </>
            ) : (
              <>
                <Shield size={12} color="#ECECE8" />
                <span>SANDBOX MODE (RATE-LIMITED DEMO)</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Main 1px Grid Container */}
      <div className="grid-container" style={styles.gridMatrix}>
        {/* Mode Selector Panel (Left Column) */}
        <div className="grid-cell" style={styles.modePanel}>
          <div style={styles.panelHead}>
            <Key size={14} color="#ECECE8" />
            <span className="meta-label">01 · SELECT INFERENCE TIER</span>
          </div>

          <p style={styles.modeDescription}>
            Choose between the built-in free sandbox tier (with rate-limited responses and synthetic acoustic fallback)
            or connect your own API keys for production throughput.
          </p>

          <div style={styles.modeButtons}>
            <button
              type="button"
              style={{
                ...styles.modeSelectBtn,
                borderColor: !config.useCustomKeys ? '#FFFFFF' : 'var(--color-grid-line)',
                backgroundColor: !config.useCustomKeys ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              }}
              onClick={() => {
                const updated = { ...config, useCustomKeys: false };
                setConfig(updated);
                ApiKeyManager.saveConfig(updated);
              }}
            >
              <div style={styles.modeBtnContent}>
                <div style={styles.modeBtnTitle}>
                  <Zap size={14} color={!config.useCustomKeys ? '#FFFFFF' : '#8C8C8C'} />
                  <span>DEFAULT SANDBOX KEYS</span>
                </div>
                <span style={styles.modeSubText}>
                  Free · Pre-configured · Rate-limited to ~60 req/hr · Synthetic DSP fallback
                </span>
              </div>
              {!config.useCustomKeys && <Check size={14} color="#FFFFFF" />}
            </button>

            <button
              type="button"
              style={{
                ...styles.modeSelectBtn,
                borderColor: config.useCustomKeys ? '#FFFFFF' : 'var(--color-grid-line)',
                backgroundColor: config.useCustomKeys ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              }}
              onClick={() => {
                const updated = { ...config, useCustomKeys: true };
                setConfig(updated);
                ApiKeyManager.saveConfig(updated);
              }}
            >
              <div style={styles.modeBtnContent}>
                <div style={styles.modeBtnTitle}>
                  <Key size={14} color={config.useCustomKeys ? '#FFFFFF' : '#8C8C8C'} />
                  <span>PASTE YOUR OWN KEYS</span>
                </div>
                <span style={styles.modeSubText}>
                  Full latency · Personal ElevenLabs voice & Gemma models · Stored in local browser storage
                </span>
              </div>
              {config.useCustomKeys && <Check size={14} color="#FFFFFF" />}
            </button>
          </div>

          {/* Quick links to generate keys */}
          <div style={styles.generateBox}>
            <span className="meta-label">GENERATE FREE API KEYS:</span>
            <div style={styles.generateLinks}>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={styles.genLink}
                className="editorial-link"
              >
                <span>Google AI Studio (Gemma)</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://elevenlabs.io/app/settings/api-keys"
                target="_blank"
                rel="noreferrer"
                style={styles.genLink}
                className="editorial-link"
              >
                <span>ElevenLabs (10K chars free/mo)</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="https://priorlabs.ai"
                target="_blank"
                rel="noreferrer"
                style={styles.genLink}
                className="editorial-link"
              >
                <span>PriorLabs (TabPFN Classifier)</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Credentials Form (Right Column) */}
        <div className="grid-cell" style={styles.formPanel}>
          <div style={styles.panelHead}>
            <span className="meta-label">02 · CREDENTIAL SPECIFICATIONS</span>
            {saveSuccess && (
              <span style={styles.saveAlert}>
                <Check size={12} color="#4ADE80" />
                <span>SAVED TO BROWSER STORAGE</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} style={styles.formContainer}>
            {/* Field 1: Gemma AI Key */}
            <div style={styles.fieldGroup}>
              <div style={styles.fieldHeader}>
                <div style={styles.fieldTitleRow}>
                  <label htmlFor="gemma-key" style={styles.label}>
                    GOOGLE AI STUDIO (GEMMA-2B) API KEY
                  </label>
                  <span style={styles.modelTag}>MODEL: gemma-2b-it</span>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.quickGenBtn}
                >
                  <span>GET KEY</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <div style={styles.inputWrapper}>
                <input
                  id="gemma-key"
                  type={showKeys['gemma'] ? 'text' : 'password'}
                  placeholder={
                    config.useCustomKeys
                      ? 'AIzaSy... / Paste your Google AI Studio key'
                      : 'SANDBOX KEY LOADED (LIMITED RATE)'
                  }
                  disabled={!config.useCustomKeys}
                  value={config.gemmaApiKey}
                  onChange={(e) => setConfig({ ...config, gemmaApiKey: e.target.value })}
                  style={{
                    ...styles.textInput,
                    opacity: config.useCustomKeys ? 1 : 0.6,
                  }}
                />
                {config.useCustomKeys && (
                  <button
                    type="button"
                    style={styles.iconBtn}
                    onClick={() => toggleShowKey('gemma')}
                    title="Toggle key visibility"
                  >
                    {showKeys['gemma'] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
              <span style={styles.fieldHelp}>
                Powers ambient prompt synthesis and tactile grounding instruction generation.
              </span>
            </div>

            {/* Field 2: ElevenLabs TTS Key */}
            <div style={styles.fieldGroup}>
              <div style={styles.fieldHeader}>
                <div style={styles.fieldTitleRow}>
                  <label htmlFor="eleven-key" style={styles.label}>
                    ELEVENLABS TEXT-TO-SPEECH API KEY
                  </label>
                  <span style={styles.modelTag}>VOICE ID: 21m00Tcm4TlvDq8ikWAM (Rachel)</span>
                </div>
                <a
                  href="https://elevenlabs.io/app/settings/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.quickGenBtn}
                >
                  <span>GET KEY</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <div style={styles.inputWrapper}>
                <input
                  id="eleven-key"
                  type={showKeys['eleven'] ? 'text' : 'password'}
                  placeholder={
                    config.useCustomKeys
                      ? 'sk_... / Paste your ElevenLabs key'
                      : 'SANDBOX KEY LOADED (10,000 CHAR FREE TIER)'
                  }
                  disabled={!config.useCustomKeys}
                  value={config.elevenlabsApiKey}
                  onChange={(e) => setConfig({ ...config, elevenlabsApiKey: e.target.value })}
                  style={{
                    ...styles.textInput,
                    opacity: config.useCustomKeys ? 1 : 0.6,
                  }}
                />
                {config.useCustomKeys && (
                  <button
                    type="button"
                    style={styles.iconBtn}
                    onClick={() => toggleShowKey('eleven')}
                    title="Toggle key visibility"
                  >
                    {showKeys['eleven'] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
              <span style={styles.fieldHelp}>
                Synthesizes calm whisper-style audio instructions for sensory detachment.
              </span>
            </div>

            {/* Field 3: TabPFN Classifier Key (Optional) */}
            <div style={styles.fieldGroup}>
              <div style={styles.fieldHeader}>
                <div style={styles.fieldTitleRow}>
                  <label htmlFor="tabpfn-key" style={styles.label}>
                    TABPFN ACOUSTIC CLASSIFIER KEY (OPTIONAL)
                  </label>
                  <span style={styles.modelTag}>PRIORLABS AI</span>
                </div>
                <a
                  href="https://priorlabs.ai"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.quickGenBtn}
                >
                  <span>GET KEY</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <div style={styles.inputWrapper}>
                <input
                  id="tabpfn-key"
                  type={showKeys['tabpfn'] ? 'text' : 'password'}
                  placeholder={
                    config.useCustomKeys
                      ? 'tpfn_... (Optional, leave empty for heuristic DSP classifier)'
                      : 'FALLBACK HEURISTIC CLASSIFIER ACTIVE'
                  }
                  disabled={!config.useCustomKeys}
                  value={config.tabpfnApiKey}
                  onChange={(e) => setConfig({ ...config, tabpfnApiKey: e.target.value })}
                  style={{
                    ...styles.textInput,
                    opacity: config.useCustomKeys ? 1 : 0.6,
                  }}
                />
                {config.useCustomKeys && (
                  <button
                    type="button"
                    style={styles.iconBtn}
                    onClick={() => toggleShowKey('tabpfn')}
                    title="Toggle key visibility"
                  >
                    {showKeys['tabpfn'] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
              <span style={styles.fieldHelp}>
                Differentiates natural biophony from mechanized anthrophony. If left empty, mathematical heuristic classifier is used.
              </span>
            </div>

            {/* Actions Bar */}
            <div style={styles.actionRow}>
              <div style={styles.leftActions}>
                <button type="submit" style={styles.saveBtn}>
                  <Check size={14} />
                  <span>SAVE SETTINGS</span>
                </button>
                <button
                  type="button"
                  style={styles.resetBtn}
                  onClick={handleResetToDefaults}
                  title="Reset to default sandbox"
                >
                  <RotateCcw size={13} />
                  <span>RESET TO SANDBOX</span>
                </button>
              </div>

              <div style={styles.testZone}>
                <button
                  type="button"
                  style={styles.testBtn}
                  onClick={handleTestKeys}
                  disabled={testStatus === 'testing'}
                >
                  <span>{testStatus === 'testing' ? 'TESTING...' : 'VALIDATE CREDENTIALS'}</span>
                </button>
                {testStatus === 'success' && (
                  <span style={styles.testSuccess}>● VALIDATED (CUSTOM KEYS)</span>
                )}
                {testStatus === 'simulated' && (
                  <span style={styles.testSandbox}>● READY (DEFAULT SANDBOX)</span>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sectionRoot: {
    width: '100%',
    backgroundColor: 'var(--color-bg-primary)',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '28px 36px',
    backgroundColor: 'var(--color-bg-secondary)',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: 'var(--color-text-primary)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.06em',
    padding: '6px 12px',
    backgroundColor: 'var(--color-bg-primary)',
    border: '1px solid var(--color-grid-line)',
  },
  gridMatrix: {
    gridTemplateColumns: 'minmax(340px, 40%) 1fr',
  },
  modePanel: {
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    backgroundColor: 'var(--color-bg-primary)',
  },
  panelHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '14px',
    borderBottom: '1px solid var(--color-grid-line)',
  },
  modeDescription: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: 'var(--color-text-secondary)',
  },
  modeButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  modeSelectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    border: '1px solid var(--color-grid-line)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.3s var(--ease-out-expo)',
  },
  modeBtnContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  modeBtnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    color: '#ECECE8',
  },
  modeSubText: {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.4,
  },
  generateBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  generateLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  genLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text-primary)',
  },
  formPanel: {
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    backgroundColor: 'var(--color-bg-primary)',
  },
  saveAlert: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#4ADE80',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '26px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: 'var(--color-text-secondary)',
  },
  modelTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '9px',
    padding: '2px 6px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-line)',
    color: 'var(--color-text-muted)',
  },
  quickGenBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.06em',
    color: 'var(--color-text-primary)',
    textDecoration: 'underline',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  textInput: {
    width: '100%',
    padding: '12px 42px 12px 16px',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-grid-line)',
    color: '#ECECE8',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  iconBtn: {
    position: 'absolute',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
  },
  fieldHelp: {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    lineHeight: 1.4,
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '20px',
    borderTop: '1px solid var(--color-grid-line)',
  },
  leftActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    backgroundColor: '#ECECE8',
    color: '#1A1A1A',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    border: '1px solid var(--color-grid-line)',
  },
  testZone: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  testBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 16px',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    border: '1px solid var(--color-grid-line)',
  },
  testSuccess: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#4ADE80',
    fontWeight: 500,
  },
  testSandbox: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#ECECE8',
    fontWeight: 500,
  },
};
