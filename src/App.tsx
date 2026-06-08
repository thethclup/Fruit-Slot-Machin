/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useSendTransaction } from 'wagmi';
import { config } from './config/wagmi';
import { SlotMachine } from './components/SlotMachine';
import { Sun } from 'lucide-react';
import { parseEther } from 'viem';

const queryClient = new QueryClient();

function AppContent() {
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      data: '0x',
      value: parseEther('0'),
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-fuchsia-500/30 overflow-hidden relative">
      {isConnected && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            Say GM
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
