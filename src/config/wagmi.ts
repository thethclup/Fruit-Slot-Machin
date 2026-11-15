import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, safe, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Fallback WalletConnect project ID
const projectId = '3fcc6bba6f1de962d911bb5b5c3dba68' // You should use your own

export const BASE_MAINNET_CHAIN_ID = base.id // 8453 (Base Mainnet - Denim 200ms canonical blocks)
export const DENIM_BLOCK_TIME_MS = 200

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Fruit Slot', preference: 'all' }),
    walletConnect({ projectId }),
    safe(),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  pollingInterval: DENIM_BLOCK_TIME_MS,
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
