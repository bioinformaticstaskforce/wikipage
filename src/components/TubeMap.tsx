import { useMemo, useState, useRef } from 'react';
import { STATIONS, TOOLS, stepsFor } from '../data';
import type { Line, Station, Step } from '../data';

/* Layout constants */
const COL_W = 180;
const ROW_H = 70;
const MARGIN_L = 120;
const MARGIN_T = 60;
const SVG_H = 480;
const CENTER_Y = SVG_H / 2;
const LINE_W = 8;
const HUB_R = 13;
const TICK_R = 7;

interface Pos { x: number; y: number }

export default function TubeMap({
  activeLines = [],
  highlightedLineId = null,
  onStationClick,
  steps = stepsFor('DNA'),
}: {
  steps?: Step[];
  activeLines?: Line[];
  highlightedLineId?: string | null;
  onStationClick?: (station: Station, lineIds: string[]) => void;
}) {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<{ id: string; x: number; y: number; toolId: string; stationData: Station; lineIds: string[] } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // The effective highlighted line is either the explicitly selected one from props, or the hovered one
  const effectiveHighlight = highlightedLineId || hoveredLine;

  /* ── Position Computation ───────────────────────────── */
  const { stationPos, stationLines, segCount, segRank } = useMemo(() => {
    const pos: Record<string, Pos> = {};
    const slines: Record<string, string[]> = {};

    STATIONS.forEach((s) => (slines[s.id] = []));
    activeLines.forEach((line) => {
      line.stops.forEach((sid) => {
        if (slines[sid] && !slines[sid].includes(line.id)) slines[sid].push(line.id);
      });
    });

    steps.forEach((step, colIdx) => {
      const x = MARGIN_L + colIdx * COL_W;
      const inStep = STATIONS.filter((s) => s.stepId === step.id);

      /* Hub stations go on CENTER_Y; branches alternate above/below */
      const hubs = inStep.filter((s) => s.type === 'hub' || s.type === 'file');
      const branches = inStep.filter((s) => s.type !== 'hub' && s.type !== 'file');

      hubs.forEach((s) => { pos[s.id] = { x, y: CENTER_Y }; });

      branches.forEach((s, i) => {
        const row = s.row ?? (i % 2 === 0 ? -1 : 1) * (Math.floor(i / 2) + 1);
        pos[s.id] = { x, y: CENTER_Y + row * ROW_H };
      });
    });

    /* Segment overlap counting for parallel offsets */
    const sCount: Record<string, number> = {};
    const sRank: Record<string, number> = {};
    const sIdx: Record<string, number> = {};

    activeLines.forEach((line) => {
      for (let i = 0; i < line.stops.length - 1; i++) {
        const key = [line.stops[i], line.stops[i + 1]].sort().join('|');
        sCount[key] = (sCount[key] || 0) + 1;
      }
    });
    activeLines.forEach((line) => {
      for (let i = 0; i < line.stops.length - 1; i++) {
        const key = [line.stops[i], line.stops[i + 1]].sort().join('|');
        const idx = sIdx[key] || 0;
        sRank[line.id + ':' + key] = idx;
        sIdx[key] = idx + 1;
      }
    });

    return { stationPos: pos, stationLines: slines, segCount: sCount, segRank: sRank };
  }, [activeLines, steps]);

  /* ── Zoom and Pan State ───────────────────────────── */
  const svgWidth = MARGIN_L + steps.length * COL_W + 40;
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: svgWidth, h: SVG_H });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const newW = viewBox.w * zoomFactor;
    const newH = viewBox.h * zoomFactor;
    
    // Zoom towards center for simplicity
    const newX = viewBox.x + (viewBox.w - newW) / 2;
    const newY = viewBox.y + (viewBox.h - newH) / 2;

    setViewBox({ x: newX, y: newY, w: newW, h: newH });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      const scaleX = viewBox.w / e.currentTarget.clientWidth;
      const scaleY = viewBox.h / e.currentTarget.clientHeight;

      setViewBox(prev => ({
        ...prev,
        x: prev.x - dx * scaleX,
        y: prev.y - dy * scaleY
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const clearHoverWithDelay = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredStation(null);
    }, 250); // 250ms grace period
  };

  const cancelHoverClear = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="tubemap-container" style={{ width: '100%', height: '100%', minHeight: '100%', overflow: 'hidden', position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className="tubemap-svg"
        preserveAspectRatio="xMidYMid meet"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', width: '100%', height: '100%' }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" className="grid-line" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" rx="10" />

        {/* Column guides + step labels */}
        {steps.map((step, i) => {
          const x = MARGIN_L + i * COL_W;
          return (
            <g key={step.id}>
              <line x1={x} y1={MARGIN_T} x2={x} y2={SVG_H - 20} strokeDasharray="3 6" className="col-rule" strokeWidth="1" />
              <text x={x} y={MARGIN_T - 14} textAnchor="middle" className="step-label">
                {step.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* Pipeline lines (drawn before stations so stations are on top) */}
        {activeLines.map((line) => {
          const stops = line.stops;
          const isFaded = effectiveHighlight !== null && effectiveHighlight !== line.id;
          const color = line.color;

          return (
            <g
              key={line.id}
              className={`tm-line-group ${isFaded ? 'faded' : ''}`}
              onMouseEnter={() => setHoveredLine(line.id)}
              onMouseLeave={() => setHoveredLine(null)}
            >
              {stops.map((sid, i) => {
                if (i === stops.length - 1) return null;
                const nextId = stops[i + 1];
                const p1 = stationPos[sid];
                const p2 = stationPos[nextId];
                if (!p1 || !p2) return null;

                const sortedKey = [sid, nextId].sort().join('|');
                const total = segCount[sortedKey] || 1;
                const rank = segRank[line.id + ':' + sortedKey] || 0;
                const spread = 12;
                const offset = (rank - (total - 1) / 2) * spread;

                /* Perpendicular offset vector */
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const px = (-dy / len) * offset;
                const py = (dx / len) * offset;

                const ax1 = p1.x + px, ay1 = p1.y + py;
                const ax2 = p2.x + px, ay2 = p2.y + py;

                /* Bezier for bends, straight for horizontal */
                const isCurve = Math.abs(p1.y - p2.y) > 2;
                const mx = (ax1 + ax2) / 2;
                const pathD = isCurve
                  ? `M${ax1},${ay1} C${mx},${ay1} ${mx},${ay2} ${ax2},${ay2}`
                  : `M${ax1},${ay1} L${ax2},${ay2}`;

                return (
                  <g key={`${sid}-${nextId}`}>
                    {/* White outline for separation */}
                    <path d={pathD} fill="none" stroke="#ffffff" strokeWidth={LINE_W + 4} strokeLinecap="round" />
                    {/* Coloured path */}
                    <path d={pathD} fill="none" stroke={color} strokeWidth={LINE_W} strokeLinecap="round" className="tm-path" opacity="0.85" />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Stations */}
        {STATIONS.map((station) => {
          const lines = stationLines[station.id];
          if (!lines || lines.length === 0) return null;

          const pos = stationPos[station.id];
          if (!pos) return null;
          const tool = TOOLS[station.toolId];
          const isHub = station.type === 'hub' || lines.length > 1;
          const primaryColor = activeLines.find((l) => l.id === lines[0])?.color || '#94a3b8';
          const isFaded = effectiveHighlight !== null && !lines.includes(effectiveHighlight);

          /* Above-centre labels go above; hub labels drop below the bundle of parallel lines */
          const labelY = pos.y < CENTER_Y ? -22 : pos.y === CENTER_Y ? 42 : 24;

          return (
            <g
              key={station.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              className={`tm-station-group ${isFaded ? 'faded' : ''}`}
              onClick={() => onStationClick?.(station, lines)}
              onMouseEnter={() => {
                setHoveredLine(lines[0]);
                cancelHoverClear();
                
                // Calculate tooltip position relative to the container
                if (svgRef.current) {
                  const pt = svgRef.current.createSVGPoint();
                  pt.x = pos.x;
                  pt.y = pos.y;
                  const screenPt = pt.matrixTransform(svgRef.current.getScreenCTM()!);
                  const containerRect = svgRef.current.parentElement!.getBoundingClientRect();
                  
                  setHoveredStation({
                    id: station.id,
                    toolId: station.toolId,
                    x: screenPt.x - containerRect.left,
                    y: screenPt.y - containerRect.top,
                    stationData: station,
                    lineIds: lines
                  });
                }
              }}
              onMouseLeave={() => {
                setHoveredLine(null);
                clearHoverWithDelay();
              }}
            >
              {isHub ? (
                <>
                  <circle r={HUB_R + 4} fill="#ffffff" />
                  <circle r={HUB_R + 2} fill="none" stroke="#334155" strokeWidth="2" />
                  <circle r={HUB_R - 1} fill="#ffffff" stroke={primaryColor} strokeWidth="3" />
                </>
              ) : (
                <>
                  <circle r={TICK_R + 2} fill="#ffffff" />
                  <circle r={TICK_R} fill="#ffffff" stroke={primaryColor} strokeWidth="3" />
                </>
              )}
              <text y={labelY} textAnchor="middle" className="station-label">
                {tool.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredStation && !isDragging && (
        <div 
          onMouseEnter={cancelHoverClear}
          onMouseLeave={clearHoverWithDelay}
          onClick={() => {
            onStationClick?.(hoveredStation.stationData, hoveredStation.lineIds);
            setHoveredStation(null);
          }}
          style={{
            position: 'absolute',
            left: hoveredStation.x,
            top: hoveredStation.y - 15,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            width: '240px',
            cursor: 'pointer',
            zIndex: 10,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            {TOOLS[hoveredStation.toolId].name}
          </h4>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {TOOLS[hoveredStation.toolId].simple.substring(0, 80)}...
          </p>
          <div style={{ marginTop: '0.4rem', fontSize: '0.65rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
            Click for details
          </div>
        </div>
      )}
    </div>
  );
}
