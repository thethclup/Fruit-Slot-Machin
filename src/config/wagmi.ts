import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, safe, walletConnect } from 'wagmi/connectors'

// Fallback WalletConnect project ID
const projectId = '3fcc6bba6f1de962d911bb5b5c3dba68' // You should use your own

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    safe(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
