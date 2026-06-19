import React from 'react';
import { Wifi } from 'lucide-react';

export default function DataSaverBanner({ enabled, onToggle }) {
  if (!enabled) return null;
  return (
    <div className="flex items-center gap-2 bg-leaf-green/10 border border-leaf-green/20 rounded-xl px-3 py-2 mx-4 mt-2">
      <Wifi className="w-4 h-4 text-leaf-green flex-shrink-0" />
      <span className="text-xs text-leaf-green font-heading font-semibold flex-1">Data Saver ON — Audio & text only</span>
      <button onClick={onToggle} className="text-xs text-leaf-green underline font-semibold">Off</button>
    </div>
  );
}
