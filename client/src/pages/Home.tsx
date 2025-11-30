import { useState } from "react";
import WorldMap from "@/components/WorldMap";
import StatsPanel from "@/components/StatsPanel";
import TopNav from "@/components/TopNav";
import LandingOverlay from "@/components/LandingOverlay";
import { useCountry, DEFAULT_STATS, ISO_NUMERIC_TO_ALPHA2 } from "@/hooks/useCountryData";
import { motion } from "framer-motion";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  // Convert numeric ID to alpha-2 code for API
  const alpha2Code = selectedCountryCode ? ISO_NUMERIC_TO_ALPHA2[selectedCountryCode] || null : null;
  
  // Debug logging
  console.log("Selected numeric ID:", selectedCountryCode, "-> Alpha-2:", alpha2Code);
  
  // Fetch country data from backend API
  const { data: countryStats, isLoading } = useCountry(alpha2Code);

  const handleCountrySelect = (countryNumericId: string | null) => {
    setSelectedCountryCode(countryNumericId);
  };

  // Use fetched data or default
  const currentStats = countryStats || (selectedCountryCode ? DEFAULT_STATS : null);

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative">
      {showIntro && <LandingOverlay onComplete={() => setShowIntro(false)} />}

      <TopNav />
      
      <main className="w-full h-full relative z-0">
         <WorldMap 
           onSelectCountry={handleCountrySelect}
           selectedCountry={selectedCountryCode}
         />
      </main>

      <StatsPanel 
        stats={currentStats} 
        isOpen={!!selectedCountryCode} 
        onClose={() => setSelectedCountryCode(null)}
        isLoading={isLoading}
      />

      {/* Floating Instructions if no country selected */}
      {!selectedCountryCode && !showIntro && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none text-white/30 font-mono text-xs tracking-widest uppercase bg-black/50 px-4 py-2 rounded backdrop-blur border border-white/10"
        >
          [ Select a Zone to Analyze ]
        </motion.div>
      )}
    </div>
  );
}
