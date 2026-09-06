// src/Dashboard.jsx
import { useState } from 'react';
import './Dashboard.css';

const WALLET_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F9';

// Middle-truncates for display, e.g. 0x71C7…976F9
function truncateAddress(address, front = 6, back = 5) {
  return `${address.slice(0, front)}…${address.slice(-back)}`;
}

function WalletPill({ address }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch (err) {
      console.error('Copy failed:', err);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="wallet-pill">
      <span className="prompt-glyph">$</span>
      <span className="addr">{truncateAddress(address)}</span>
      <span className="cursor" aria-hidden="true"></span>
      <button
        type="button"
        className={`copy-btn${copied ? ' copied' : ''}`}
        onClick={handleCopy}
        aria-label={copied ? 'Address copied' : 'Copy wallet address'}
        title="Copy address"
      >
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>
    </div>
  );
}

function StatCard({ eyebrow, value, mono, trend }) {
  return (
    <div className="dashboard-card">
      <p className="card-eyebrow">{eyebrow}</p>
      <p className={`stat-value${mono ? ' mono' : ''}`}>{value}</p>
      {trend && (
        <span className={`stat-trend${trend.direction === 'down' ? ' down' : ''}`}>
          {trend.direction === 'down' ? '▼' : '▲'} {trend.label}
          {trend.sublabel && <span className="muted"> {trend.sublabel}</span>}
        </span>
      )}
    </div>
  );
}

const TRANSACTIONS = [
  { hash: '0xa3f1', hashEnd: '9c2d', type: 'Swap', amount: '−0.45 ETH', direction: 'out', status: 'success' },
  { hash: '0x7be0', hashEnd: '44a1', type: 'Receive', amount: '+1,200 USDC', direction: 'in', status: 'success' },
  { hash: '0xd912', hashEnd: '0ef7', type: 'Stake', amount: '−2.0 ETH', direction: 'out', status: 'pending' },
];

function TransactionsCard() {
  return (
    <div className="dashboard-card wide">
      <div className="card-eyebrow" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Recent Transactions</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tx Hash</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {TRANSACTIONS.map((tx) => (
            <tr key={tx.hash + tx.hashEnd}>
              <td className="hash">
                {tx.hash}
                <span className="fade">…</span>
                {tx.hashEnd}
              </td>
              <td>{tx.type}</td>
              <td className={tx.direction === 'in' ? 'amount-in' : 'amount-out'}>{tx.amount}</td>
              <td>
                <span className={`badge ${tx.status}`}>
                  {tx.status === 'success' ? 'Confirmed' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '2rem',
        }}
      >
        <h1>Portfolio Overview</h1>
        <WalletPill address={WALLET_ADDRESS} />
      </div>

      <div className="dashboard-section">
        <div className="dashboard-grid">
          <StatCard
            eyebrow="Total Balance"
            value="$48,204.12"
            trend={{ direction: 'up', label: '3.2%', sublabel: '24h' }}
          />
          <StatCard
            eyebrow="ETH Holdings"
            value="12.842 ETH"
            mono
            trend={{ direction: 'down', label: '1.1%', sublabel: '24h' }}
          />
          <StatCard eyebrow="Gas Spent" value="0.081 ETH" mono trend={{ label: 'last 30 days' }} />
          <div className="dashboard-card">
            <p className="card-eyebrow">Network</p>
            <p className="stat-value">Ethereum</p>
            <span className="badge success">Connected</span>
          </div>

          <TransactionsCard />
        </div>
      </div>
    </div>
  );
}