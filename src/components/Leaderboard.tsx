import { Trophy, Medal, Star } from "lucide-react";

export function Leaderboard() {
  const MOCK_LEADERS = [
    { rank: 1, address: '0x12..ab3', score: 25000 },
    { rank: 2, address: '0x99..4fa', score: 12500 },
    { rank: 3, address: '0x33..cd9', score: 8000 },
    { rank: 4, address: '0x4f..e12', score: 5000 },
    { rank: 5, address: '0xb2..88c', score: 4500 },
  ];

  return (
    <div className="bg-black/30 border border-white/5 rounded-3xl p-5 backdrop-blur-sm shadow-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs uppercase text-blue-400 font-bold tracking-tighter">Top Players</h3>
        <span className="text-[10px] text-gray-500 uppercase">Season 1</span>
      </div>

      <div className="flex flex-col gap-3 relative">
        {MOCK_LEADERS.map((leader, i) => (
          <div 
            key={leader.rank} 
            className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5 hover:bg-black/60 transition-colors"
          >
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 w-4 text-center font-bold">
                {leader.rank}
              </span>
              <span className="font-mono text-gray-300">{leader.address}</span>
            </div>
            <div className="flex items-center font-mono">
              <span className="text-white">{leader.score.toLocaleString()}</span>
              <span className="text-yellow-500 text-xs ml-1">🪙</span>
            </div>
          </div>
        ))}
        
        <div className="mt-4 bg-black/40 border border-emerald-500/20 rounded-3xl p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-[8px] text-black font-black uppercase rounded-bl-lg">SECURE</div>
          <p className="text-[10px] text-emerald-400 uppercase font-bold mb-1">Base Attribution</p>
          <p className="text-[11px] font-mono text-gray-300">BUILDER: bc_ee3cipj7</p>
          <p className="text-[9px] text-gray-500 mt-2 italic">All wins verified by ERC-8004 Trustless Agents</p>
        </div>
      </div>
    </div>
  );
}
