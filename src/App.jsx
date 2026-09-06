 import { useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useDispatch, useSelector } from 'react-redux'
import { setWalletInfo, clearWallet } from './store/walletSlice.js'
import { fetchNativeBalance, fetchTokenBalances, fetchNFTs } from './store/tokensSlice.js'
import { fetchTransactions } from './store/transactionsSlice.js'
import PriceChart from './PriceChart.jsx'
import { selectTransactionSummary } from './store/selectors.js'
import WalletStatus from './WalletStatus.jsx'
import './Dashboard.css'

function App() {
  const { address, isConnected, chain } = useAccount()
  const dispatch = useDispatch()

  const walletFromRedux = useSelector((state) => state.wallet)
  const tokens = useSelector((state) => state.tokens)
  const txSummary = useSelector(selectTransactionSummary)
  const transactions = useSelector((state) => state.transactions)

  // Sync wallet connection info into Redux (same as before)
  useEffect(() => {
    if (isConnected) {
      dispatch(
        setWalletInfo({
          address,
          chainId: chain?.id,
          chainName: chain?.name,
          isConnected: true,
        })
      )
      // As soon as we know the address, go fetch its balance, tokens, NFTs, and transactions
      dispatch(fetchNativeBalance(address))
      dispatch(fetchTokenBalances(address))
      dispatch(fetchNFTs(address))
      dispatch(fetchTransactions(address))
    } else {
      dispatch(clearWallet())
    }
  }, [address, isConnected, chain, dispatch])

  return (
    <div className="dashboard">
      <h1>Web3 Dashboard</h1>

      <ConnectButton />

      <div className="dashboard-section">
        <h2>Wallet</h2>
        <WalletStatus
          isConnected={walletFromRedux.isConnected}
          address={walletFromRedux.address}
          chainName={walletFromRedux.chainName}
        />
      </div>

      <div className="dashboard-section">
        <h2>Balance</h2>
        {tokens.nativeStatus === 'loading' && <p>Loading balance...</p>}
        {tokens.nativeStatus === 'failed' && <p>Error: {tokens.nativeError}</p>}
        {tokens.nativeStatus === 'succeeded' && (
          <p>{tokens.nativeBalance} ETH (Sepolia)</p>
        )}
      </div>

      <div className="dashboard-section">
        <h2>ERC-20 Tokens</h2>
        {tokens.erc20Status === 'loading' && <p>Loading tokens...</p>}
        {tokens.erc20Status === 'failed' && <p>Error: {tokens.erc20Error}</p>}
        {tokens.erc20Status === 'succeeded' && (
          tokens.erc20Tokens.length === 0 ? (
            <p>No ERC-20 tokens found in this wallet.</p>
          ) : (
            <ul>
              {tokens.erc20Tokens.map((token) => (
                <li key={token.contractAddress}>
                  {token.contractAddress}: {token.tokenBalance}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      <div className="dashboard-section">
        <h2>NFTs</h2>
        {tokens.nftStatus === 'loading' && <p>Loading NFTs...</p>}
        {tokens.nftStatus === 'failed' && <p>Error: {tokens.nftError}</p>}
        {tokens.nftStatus === 'succeeded' && (
          tokens.nfts.length === 0 ? (
            <p>No NFTs found in this wallet.</p>
          ) : (
            <ul>
              {tokens.nfts.map((nft) => (
                <li key={`${nft.contract?.address}-${nft.tokenId}`}>
                  {nft.name || nft.contract?.name || 'Unnamed NFT'} (#{nft.tokenId})
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      <div className="dashboard-section">
        <h2>Recent Transactions</h2>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Summary (via memoized selector): {txSummary.total} total — {txSummary.ethTransfers} ETH, {txSummary.tokenTransfers} token transfers
        </p>
        {transactions.status === 'loading' && <p>Loading transactions...</p>}
        {transactions.status === 'failed' && <p>Error: {transactions.error}</p>}
        {transactions.status === 'succeeded' && (
          transactions.items.length === 0 ? (
            <p>No transactions found for this wallet.</p>
          ) : (
            <ul>
              {transactions.items.map((tx) => (
                <li key={tx.uniqueId || tx.hash}>
                  {tx.asset || 'ETH'} — {tx.from} → {tx.to} ({tx.metadata?.blockTimestamp})
                </li>
              ))}
            </ul>
          )
        )}
      </div>
      <div className="dashboard-section">
        <h2>ETH Price (Last 7 Days)</h2>
        <PriceChart />
      </div>
    </div>
  )
}
export default App