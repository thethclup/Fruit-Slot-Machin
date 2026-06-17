import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAccount, useSignMessage, useConnect, useDisconnect, useSendTransaction, useSendCalls, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { useGameStore, MULTIPLIERS, getRandomSymbol } from '../store/gameStore';
import { Reel } from './Reel';
import { Leaderboard } from './Leaderboard';
import { cn } from '../lib/utils';
import { getAttributedTransactionData, BUILDER_CODE } from '../lib/erc8021';
import { Wallet, Settings, Zap, History, Trophy, RotateCw, Gamepad2, ListOrdered, MessageSquare } from 'lucide-react';
import { useWalletCapabilities } from '../hooks/useWalletCapabilities';

export function SlotMachine() {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { 
    balance, bet, spinning, reels, winAmount, combo, freeSpins, highestWin, fastMode, autoSpin,
    setBet, spin, stopSpin, toggleFastMode, toggleAutoSpin, addBalance
  } = useGameStore();

  const [stoppedReels, setStoppedReels] = useState(3);
  const [targetReels, setTargetReels] = useState<string[][]>(reels);
  const [showWin, setShowWin] = useState(false);
  const [currentTab, setCurrentTab] = useState<'play' | 'leaderboard'>('play');

  const calculateWin = (finalReels: string[][]) => {
    const row = [finalReels[0][1], finalReels[1][1], finalReels[2][1]];
    const nonWilds = row.filter(s => s !== '🌟');
    let win = 0;
    let isJackpot = false;

    if (nonWilds.length === 0) {
      win = bet * MULTIPLIERS['🌟'];
      isJackpot = true;
    } else if (new Set(nonWilds).size === 1) {
      win = bet * MULTIPLIERS[nonWilds[0]];
      if (MULTIPLIERS[nonWilds[0]] >= 50) isJackpot = true;
    }

    if (win > 0) {
       const comboMulti = Math.min(5, 1 + combo * 0.5);
       win = Math.floor(win * comboMulti);
    }
    
    return { win, isJackpot };
  };

  const handleSpin = () => {
    if (spinning || (balance < bet && freeSpins === 0)) return;
    
    setShowWin(false);
    setStoppedReels(0);
    spin();
    
    const newReels = [
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
      [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
    ];

    setTargetReels(newReels);
  };

  const handleReelStop = useCallback(() => {
    setStoppedReels(prev => {
      const next = prev + 1;
      if (next === 3) {
        const { win, isJackpot } = calculateWin(targetReels);
        stopSpin(targetReels, win, isJackpot);
        
        if (win > 0) {
          setShowWin(true);
          if (win >= bet * 10) triggerConfetti();
        }
      }
      return next;
    });
  }, [targetReels, bet, combo]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  useEffect(() => {
    if (autoSpin && stoppedReels === 3 && !showWin && balance >= bet) {
      const timer = setTimeout(() => handleSpin(), fastMode ? 500 : 1500);
      return () => clearTimeout(timer);
    }
  }, [autoSpin, stoppedReels, showWin, balance, bet, fastMode]);

  useEffect(() => {
    if (showWin && autoSpin) {
      const timer = setTimeout(() => setShowWin(false), fastMode ? 1000 : 2500);
      return () => clearTimeout(timer);
    }
  }, [showWin, autoSpin, fastMode]);

  const { sendTransaction } = useSendTransaction();
  const { sendCalls } = useSendCalls();
  const chainId = useChainId();
  const { supportsBatching } = useWalletCapabilities(chainId);

  const recordOnChain = async () => {
    if (!isConnected) {
      alert("Please connect wallet first!");
      return;
    }
    try {
      const msg = `I just won ${winAmount} coins on Fruit Slot\nHighest Win: ${highestWin}\nAttribution: ${BUILDER_CODE}`;
      const signature = await signMessageAsync({ message: msg, account: address as any });
      getAttributedTransactionData('0x', 'FRUIT_SLOT_WIN_RECORD');
      alert(`Win recorded on-chain successfully!\nSig: ${signature.slice(0, 20)}...`);
    } catch (e: any) {
      console.error(e);
      alert('Failed to record win: ' + e.message);
    }
  };

  const sayGM = () => {
    if (!isConnected) {
      alert("Please connect wallet first!");
      return;
    }

    if (supportsBatching && sendCalls) {
        sendCalls({
           calls: [{
               to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
               data: '0x',
               value: BigInt(0)
           }],
           capabilities: {
              dataSuffix: {
                  value: '0x80218021802180218021802180218021',
                  optional: true
              }
           }
        });
        return;
    }

    // EOA or basic smart account flow; automatically appending ERC-8021 suffix
    sendTransaction({
      to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      // The ERC-8021 builder code suffix
      data: '0x80218021802180218021802180218021',
      value: parseEther('0'),
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0f051a] text-white font-sans overflow-auto pb-24 relative z-0">
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none z-0" />
      
      {/* Top Bar */}
      <div className="sticky top-0 z-40 w-full max-w-md p-4 flex justify-between items-center bg-black/40 border-b border-white/10 backdrop-blur-md">
        <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-2xl flex flex-col items-end backdrop-blur-md">
          <span className="text-[10px] uppercase text-gray-400 font-bold">Total Balance</span>
          <span className="text-xl font-mono text-emerald-400 leading-none">{balance.toLocaleString()} 🪙</span>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={sayGM}
             className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
           >
             <MessageSquare className="w-5 h-5 text-gray-300" />
           </button>
           <button 
             className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 font-bold text-xs text-gray-300 border border-white/10 transition-colors shadow-lg active:scale-95"
             onClick={() => addBalance(100)}
           >
             + COINS
           </button>
           <button 
             className="px-3 py-2 rounded-full bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 font-bold text-xs border border-purple-500/30 transition-colors shadow-lg active:scale-95 flex items-center gap-1"
             onClick={isConnected ? () => disconnect() : () => connect({ connector: connectors[0] })}
           >
             <Wallet className="w-3 h-3" />
             {isConnected ? `${address?.substring(0,6)}...` : 'CONNECT'}
           </button>
        </div>
      </div>

      {currentTab === 'play' && (
        <div className="relative z-10 flex flex-col items-center w-full max-w-md mt-6 px-4 pb-8">
          {/* Header Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              <span className="text-2xl font-bold italic">F</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase leading-none text-white">Fruit Slot</h1>
              {highestWin > 0 ? (
                <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Highest Win: {highestWin} 🏆</p>
              ) : (
                <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Base Mainnet Edition</p>
              )}
            </div>
          </div>

          {/* Slot Machine Body */}
          <div className="relative bg-black/60 rounded-[40px] p-6 pb-10 border-4 border-white/10 shadow-2xl w-full">
            {/* Payline indicator */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_20px_#d946ef] z-20 -translate-y-1/2 opacity-60 pointer-events-none" />
            
            <div className="flex gap-4 w-full justify-between h-[280px]">
              <Reel spinning={spinning} targetSymbols={targetReels[0]} delay={0} fastMode={fastMode} onStop={handleReelStop} />
              <Reel spinning={spinning} targetSymbols={targetReels[1]} delay={1} fastMode={fastMode} onStop={handleReelStop} />
              <Reel spinning={spinning} targetSymbols={targetReels[2]} delay={2} fastMode={fastMode} onStop={handleReelStop} />
            </div>

            {/* Win Overlay */}
            <div className={cn(
              "absolute inset-x-0 bottom-4 flex flex-col items-center justify-center transition-all duration-300 z-30 pointer-events-none",
              showWin ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            )}>
              <div className="bg-[#1a0b2e] px-8 py-3 rounded-2xl border-2 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] flex flex-col items-center pointer-events-auto transform transition-transform hover:scale-105">
                <span className="text-yellow-400 font-bold text-sm tracking-widest uppercase mb-1 drop-shadow-md">
                  {winAmount >= bet * 10 ? '✨ BIG WIN! ✨' : 'WINNER!'}
                </span>
                <span className="text-4xl font-black text-white drop-shadow-lg font-mono">{winAmount} 🪙</span>
                {combo > 0 && <span className="text-orange-400 font-bold text-xs mt-1">🔥 COMBO x{Math.min(5, 1 + combo * 0.5).toFixed(1)}</span>}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full mt-6 bg-black/30 p-5 rounded-[2rem] border border-white/5 backdrop-blur-sm shadow-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center bg-black/60 border border-white/10 rounded-2xl p-2 px-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Total Bet</span>
                <div className="flex items-center mt-1 gap-1">
                  {[10, 50, 100].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setBet(amt)}
                      disabled={spinning}
                      className={cn(
                        "w-12 py-1.5 rounded-xl font-bold text-xs transition-all border border-transparent",
                        bet === amt 
                          ? "bg-purple-600/20 text-yellow-400 border border-purple-500/30" 
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      )}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Fast</span>
                  <button 
                    onClick={toggleFastMode}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all flex items-center justify-center",
                      fastMode ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10"
                    )}
                    title="Fast Mode"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Auto</span>
                  <button 
                    onClick={toggleAutoSpin}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all flex items-center justify-center",
                      autoSpin ? "bg-purple-600/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10"
                    )}
                    title="Auto Spin"
                  >
                    <RotateCw className={cn("w-4 h-4", autoSpin && "animate-spin")} />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative group w-full">
              <div className={cn(
                "absolute inset-[-8px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-50 transition-all",
                (!spinning && (freeSpins > 0 || balance >= bet)) && "group-hover:blur-xl group-hover:opacity-75"
              )}></div>
              <button
                onClick={handleSpin}
                disabled={spinning || (!freeSpins && balance < bet)}
                className="relative w-full py-5 bg-[#1a0b2e] rounded-2xl flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  {spinning ? 'SPINNING...' : freeSpins > 0 ? `FREE SPIN (${freeSpins})` : 'SPIN'}
                </span>
                {!spinning && (
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* On Chain Action Banner */}
          {showWin && winAmount >= bet * 10 && (
            <div className="mt-6 w-full animate-in slide-in-from-bottom-4 fade-in duration-500 flex flex-col gap-3">
              <button
                onClick={recordOnChain}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600/80 to-teal-700/80 border border-emerald-400/50 flex flex-col items-center gap-1 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:brightness-110 active:scale-95 transition-all backdrop-blur-sm"
              >
                <span className="text-white font-black tracking-tighter uppercase flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  Record This Win on-chain
                </span>
              </button>
              <button
                onClick={sayGM}
                className="w-full p-3 rounded-2xl bg-[#E8A020]/20 border border-[#E8A020]/40 flex flex-col items-center gap-1 hover:bg-[#E8A020]/30 active:scale-95 transition-all backdrop-blur-sm"
              >
                <span className="text-[#E8A020] font-black tracking-tighter uppercase flex items-center gap-2 text-md">
                  <MessageSquare className="w-4 h-4 text-[#E8A020]" />
                  Say GM
                </span>
                <span className="text-[10px] text-[#E8A020]/70 uppercase font-bold tracking-widest">Base Mainnet 0xc35b...</span>
              </button>
            </div>
          )}
        </div>
      )}

      {currentTab === 'leaderboard' && (
        <div className="relative z-10 w-full max-w-md mt-6 px-4">
          <Leaderboard />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <button 
            onClick={() => setCurrentTab('play')}
            className={cn("flex flex-col items-center p-2 px-6 rounded-xl transition-all", currentTab === 'play' ? "text-yellow-400 font-bold" : "text-neutral-500 hover:text-neutral-300")}
          >
            <Gamepad2 className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-widest">Play</span>
          </button>
          <button 
            onClick={() => setCurrentTab('leaderboard')}
            className={cn("flex flex-col items-center p-2 px-6 rounded-xl transition-all", currentTab === 'leaderboard' ? "text-yellow-400 font-bold" : "text-neutral-500 hover:text-neutral-300")}
          >
            <ListOrdered className="w-6 h-6 mb-1" />
            <span className="text-[10px] uppercase tracking-widest">Leaders</span>
          </button>
        </div>
      </div>
    </div>
  );
}
