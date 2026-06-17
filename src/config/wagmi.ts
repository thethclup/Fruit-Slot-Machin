import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected, safe, walletConnect, coinbaseWallet } from 'wagmi/connectors'

// Fallback WalletConnect project ID
const projectId = '3fcc6bba6f1de962d911bb5b5c3dba68' // You should use your own

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    // @ts-ignore: if baseAccount isn't exported in this version, fallback to coinbaseWallet. But we try importing it if possible, here we'll stick to coinbaseWallet as it's the standard viem/wagmi connector.
    coinbaseWallet({ appName: 'Fruit Slot', preference: 'all' }),
    walletConnect({ projectId }),
    safe(),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
