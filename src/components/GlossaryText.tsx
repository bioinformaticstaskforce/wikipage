import React from 'react';
import GlossaryTooltip from './GlossaryTooltip';
import { GLOSSARY } from '../data';

interface Props {
  text: string;
}

export default function GlossaryText({ text }: Props) {
  // Sort terms by length descending to avoid partial matches (e.g. matching "WGS" inside "WGS-based")
  const terms = [...GLOSSARY].sort((a, b) => b.term.length - a.term.length);
  
  // Create a regex to match any of the terms
  const escapedTerms = terms.map(t => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const isTerm = terms.some(t => t.term.toLowerCase() === lowerPart);
        
        if (isTerm) {
          return (
            <GlossaryTooltip key={i} term={part}>
              {part}
            </GlossaryTooltip>
          );
        }
        
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
