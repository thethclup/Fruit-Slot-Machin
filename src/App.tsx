/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount } from 'wagmi';
import { config } from './config/wagmi';
import { SlotMachine } from './components/SlotMachine';
import { Sun, Loader2, Check } from 'lucide-react';
import { useDenimTransaction } from './hooks/useDenimTransaction';

const queryClient = new QueryClient();

function AppContent() {
  const { isConnected } = useAccount();
  const {
    sendGM,
    isWrongNetwork,
    isPending,
    isConfirming,
    isConfirmed,
    blockNumber,
  } = useDenimTransaction();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-fuchsia-500/30 overflow-hidden relative">
      {isConnected && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={sendGM}
            disabled={isPending || isConfirming}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-60"
          >
            {isPending || isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isConfirmed ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            {isWrongNetwork
              ? 'Switch to Base & GM'
              : isPending
              ? 'Confirm Wallet...'
              : isConfirming
              ? 'Confirming (200ms)...'
              : isConfirmed
              ? `GM Confirmed${blockNumber ? ` #${blockNumber.toString()}` : ''}`
              : 'Say GM'}
          </button>
        </div>
      )}
      <SlotMachine />
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
