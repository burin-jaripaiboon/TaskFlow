import type { ReactNode } from 'react';
import '../../styles/SequentialAppearance.css';


export default function SequentialAnimation({ children, delay = 0, duration = 1 }: { children: ReactNode, delay?: number, duration?: number }) {
  return (
    <div 
      className="sequential-element-wrapper"
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }} 
    >
      <div className="sequential-element-content" style={{ display:'flex', flexDirection: 'row', gap: '0.5vw' }}>
        {children}
      </div>
    </div>
  );
};