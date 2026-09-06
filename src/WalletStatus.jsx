// src/WalletStatus.jsx
//
// Extracted from App.jsx so it can be tested on its own, without needing
// to render the entire App (which depends on Wagmi, RainbowKit, charts, etc).

function WalletStatus({ isConnected, address, chainName }) {
  if (!isConnected) {
    return <p>No wallet connected yet.</p>
  }

  return (
    <div>
      <p>✅ Connected!</p>
      <p>Address: {address}</p>
      <p>Network: {chainName}</p>
    </div>
  )
}

export default WalletStatus