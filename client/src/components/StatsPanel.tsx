import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  LineChart, Line 
} from "recharts";
import { X, Shield, Users, TrendingUp, DollarSign, Activity, Globe, Lock, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CountryStats } from "@/hooks/useCountryData";
import { clsx } from "clsx";

interface StatsPanelProps {
  stats: CountryStats | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

const NEON_PURPLE = "#9d4edd";
const NEON_PINK = "#ff1b6b";
const DARK_BG = "#050505";

export default function StatsPanel({ stats, isOpen, onClose, isLoading = false }: StatsPanelProps) {
  const [activeTab, setActiveTab] = useState<"demographics" | "military" | "crime" | "economic">("demographics");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-black/80 backdrop-blur-xl border-l border-neon-purple/30 shadow-[-10px_0_30px_rgba(157,78,221,0.1)] z-40 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-transparent via-neon-purple/5 to-transparent">
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                {isLoading ? "Loading..." : (stats?.name || "Unknown")}
              </h2>
              <div className="text-xs text-neon-pink font-mono mt-1 animate-pulse">
                ID: {stats?.id || "---"} // STATUS: {isLoading ? "FETCHING" : "ONLINE"}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors group"
            >
              <X className="w-6 h-6 text-white/50 group-hover:text-neon-pink transition-colors" />
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-neon-purple animate-spin mx-auto mb-4" />
                <p className="text-white/50 text-sm font-mono">Fetching data from API...</p>
              </div>
            </div>
          )}

          {/* Content when loaded */}
          {!isLoading && stats && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-white/5">
            {[
              { id: "demographics", icon: Users, label: "DEMO" },
              { id: "military", icon: Shield, label: "MIL" },
              { id: "crime", icon: Lock, label: "CRIME" },
              { id: "economic", icon: DollarSign, label: "ECO" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-all relative overflow-hidden",
                  activeTab === tab.id 
                    ? "text-neon-purple bg-neon-purple/5" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-display tracking-widest">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-purple shadow-[0_0_10px_#9d4edd]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8 pb-20">
              
              {activeTab === "demographics" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Total Population" value={stats.demographics.population.toLocaleString()} />
                    <StatCard label="Average IQ" value={stats.demographics.avgIq} />
                    <StatCard label="Literacy Rate" value={stats.demographics.literacyRate} />
                    <StatCard label="Child Pop." value={stats.demographics.childPop} />
                  </div>

                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <h3 className="text-sm text-white/60 mb-4 font-display">Addiction Rates</h3>
                    <div className="space-y-3">
                      <ProgressBar label="Smoking" value={parseInt(stats.demographics.addictionRates.smoking)} color={NEON_PINK} />
                      <ProgressBar label="Alcohol" value={parseInt(stats.demographics.addictionRates.alcohol)} color={NEON_PURPLE} />
                      <ProgressBar label="Substances" value={parseInt(stats.demographics.addictionRates.substances)} color="#ffffff" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "military" && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                   <div className="flex items-center justify-between bg-white/5 p-4 rounded border border-neon-purple/30">
                     <div>
                       <div className="text-xs text-neon-purple uppercase tracking-wider">Global Rank</div>
                       <div className="text-4xl font-display font-bold text-white mt-1">#{stats.military.rank}</div>
                     </div>
                     <Shield className="w-12 h-12 text-neon-purple opacity-50" />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <StatCard label="Active Personnel" value={stats.military.activePersonnel.toLocaleString()} />
                     <StatCard label="Budget" value={stats.military.budget} />
                   </div>

                   <div className="h-64 w-full bg-white/5 rounded p-4 border border-white/10 relative">
                      <h3 className="text-sm text-white/60 mb-2 font-display absolute top-4 left-4">Asset Distribution</h3>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.military.assets}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {stats.military.assets.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={[NEON_PURPLE, NEON_PINK, "#ffffff"][index % 3]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'black', borderColor: '#333', borderRadius: '4px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-xs text-white/40">TOTAL</div>
                          <div className="text-lg font-bold text-white">100%</div>
                        </div>
                      </div>
                   </div>
                 </div>
              )}

              {activeTab === "crime" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="bg-red-900/10 border border-red-500/30 p-4 rounded flex items-center gap-4">
                    <Activity className="text-red-500 w-8 h-8" />
                    <div>
                      <div className="text-red-400 text-xs uppercase tracking-wider">Crime Index</div>
                      <div className="text-2xl font-bold text-white">{stats.crime.index} / 100</div>
                    </div>
                  </div>

                  <div className="h-64 w-full bg-white/5 rounded p-4 border border-white/10">
                    <h3 className="text-sm text-white/60 mb-4 font-display">Crime Trend (Yearly)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.crime.trend}>
                        <XAxis dataKey="year" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'black', borderColor: '#333' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={NEON_PINK} 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: NEON_PINK, strokeWidth: 0 }}
                          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === "economic" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="grid grid-cols-1 gap-4">
                    <StatCard label="GDP Per Capita" value={stats.economic.gdpPerCapita} highlighted />
                    <StatCard label="Government Type" value={stats.economic.govType} />
                  </div>

                  <div className="bg-white/5 p-4 rounded border border-white/10">
                    <h3 className="text-sm text-white/60 mb-4 font-display">Memberships</h3>
                    <div className="flex flex-wrap gap-2">
                      {stats.economic.memberships.map((m) => (
                        <span key={m} className="px-3 py-1 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs rounded font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-white/10 rounded bg-gradient-to-r from-transparent to-white/5">
                    <div className="flex items-center gap-3">
                      <Globe className="text-white/50 w-5 h-5" />
                      <span className="text-sm text-white/70">Passport Power Rank</span>
                    </div>
                    <span className="text-xl font-bold text-white">#{stats.economic.passportRank}</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ label, value, highlighted = false }: { label: string, value: string | number, highlighted?: boolean }) {
  return (
    <div className={clsx(
      "p-4 rounded border flex flex-col",
      highlighted 
        ? "bg-neon-purple/10 border-neon-purple/50 shadow-[0_0_15px_rgba(157,78,221,0.15)]" 
        : "bg-white/5 border-white/10"
    )}>
      <span className="text-xs text-white/40 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-lg font-bold text-white font-display">{value}</span>
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string, value: number, color: string }) {
  const displayValue = isNaN(value) ? 0 : value;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="text-white font-mono">{isNaN(value) ? "N/A" : `${value}%`}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full rounded-full shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: color, color: color }}
        />
      </div>
    </div>
  );
}
