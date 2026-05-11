/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { SlotMachine } from './components/SlotMachine';

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-fuchsia-500/30 overflow-hidden">
          <SlotMachine />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
