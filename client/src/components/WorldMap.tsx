import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { motion, AnimatePresence } from "framer-motion";

interface WorldMapProps {
  onSelectCountry: (countryId: string | null) => void;
  selectedCountry: string | null;
}

export default function WorldMap({ onSelectCountry, selectedCountry }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((response) => response.json())
      .then((data) => {
        setGeoData(data);
      });
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous render
    svg.selectAll("*").remove();

    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.6]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    // Background grid
    const graticule = d3.geoGraticule();
    g.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path)
      .attr("fill", "none")
      .attr("stroke", "#1a1a1a")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.5);

    const countries = topojson.feature(geoData, geoData.objects.countries) as any;

    g.selectAll("path.country")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("class", "country")
      .attr("fill", "#050505")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease")
      .on("mouseenter", function(event, d: any) {
        const countryName = d.properties.name;
        
        d3.select(this)
          .attr("fill", "rgba(157, 78, 221, 0.2)")
          .attr("stroke", "#9d4edd")
          .attr("stroke-width", 1.5)
          .attr("filter", "url(#glow)");

        setTooltip({
          x: event.clientX,
          y: event.clientY,
          name: countryName
        });
      })
      .on("mousemove", function(event) {
        setTooltip(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
      })
      .on("mouseleave", function(event, d: any) {
        const numericId = String(d.id);
        
        if (selectedCountry !== numericId) {
           d3.select(this)
            .attr("fill", "#050505")
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .attr("filter", null);
        } else {
           d3.select(this)
            .attr("fill", "rgba(255, 27, 107, 0.2)")
            .attr("stroke", "#ff1b6b")
            .attr("stroke-width", 2)
            .attr("filter", "url(#glow-pink)");
        }
        
        setTooltip(null);
      })
      .on("click", function(event, d: any) {
         // Pass the numeric ID directly - Home.tsx will convert to alpha-2
         const numericId = String(d.id);
         onSelectCountry(numericId);
         
         // Reset all others
         g.selectAll("path.country")
           .attr("fill", "#050505")
           .attr("stroke", "#333")
           .attr("stroke-width", 0.5)
           .attr("filter", null);

         // Highlight clicked
         d3.select(this)
            .attr("fill", "rgba(255, 27, 107, 0.2)")
            .attr("stroke", "#ff1b6b")
            .attr("stroke-width", 2)
            .attr("filter", "url(#glow-pink)");
      });

    // Definitions for glow filters
    const defs = svg.append("defs");
    
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
      
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "coloredBlur");
      
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const filterPink = defs.append("filter")
      .attr("id", "glow-pink")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
      
    filterPink.append("feGaussianBlur")
      .attr("stdDeviation", "6")
      .attr("result", "coloredBlur");
      
    const feMergePink = filterPink.append("feMerge");
    feMergePink.append("feMergeNode").attr("in", "coloredBlur");
    feMergePink.append("feMergeNode").attr("in", "SourceGraphic");

  }, [geoData]); // Re-run if data loads. Not re-running on 'selectedCountry' to avoid full re-draw flicker, handling selection in D3 event.

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <svg ref={svgRef} className="w-full h-full block" />
      
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ left: tooltip.x + 20, top: tooltip.y - 20 }}
            className="fixed pointer-events-none z-50 bg-black/80 border border-neon-purple/50 text-neon-purple px-3 py-1 rounded backdrop-blur-md text-sm font-display tracking-wider shadow-[0_0_15px_rgba(157,78,221,0.4)]"
          >
            {tooltip.name}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(157,78,221,0.05),transparent_70%)]" />
    </div>
  );
}
