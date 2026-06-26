"use client";

import { Loader2, Wine } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg">
          <Wine className="w-10 h-10 text-pitch" />
        </div>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
          <span className="text-lg font-medium">Chargement...</span>
        </div>
      </div>
    </div>
  );
}
