// src/wagmi.js
// This file sets up Wagmi + RainbowKit: which network we support,
// and which Alchemy endpoint to use to talk to that network.

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

const ALCHEMY_SEPOLIA_URL = 'https://eth-sepolia.g.alchemy.com/v2/B19pUEThM5VtARuV4k0t2';

export const config = getDefaultConfig({
  appName: 'Web3 Dashboard',
  projectId: 'b20023734fa3eb696af5339cdd0a9f7d', // WalletConnect Project ID
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(ALCHEMY_SEPOLIA_URL),
  },
});