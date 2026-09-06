// src/WalletStatus.test.jsx
//
// This tests a REACT COMPONENT'S rendered output for different states —
// exactly what the project plan asked for: "wallet connect button states."

import { render, screen } from '@testing-library/react'
import WalletStatus from './WalletStatus.jsx'

describe('WalletStatus', () => {
  test('shows "No wallet connected" when disconnected', () => {
    render(<WalletStatus isConnected={false} address={null} chainName={null} />)

    expect(screen.getByText('No wallet connected yet.')).toBeInTheDocument()
  })

  test('shows the address and network when connected', () => {
    render(
      <WalletStatus
        isConnected={true}
        address="0x951eC...2b31f"
        chainName="Sepolia"
      />
    )

    expect(screen.getByText('✅ Connected!')).toBeInTheDocument()
    expect(screen.getByText(/0x951eC...2b31f/)).toBeInTheDocument()
    expect(screen.getByText(/Sepolia/)).toBeInTheDocument()
  })

  test('does NOT show the connected message when disconnected', () => {
    render(<WalletStatus isConnected={false} address={null} chainName={null} />)

    expect(screen.queryByText('✅ Connected!')).not.toBeInTheDocument()
  })
})