"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function DndPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof window === "undefined" || !mounted) return null;
  
  const el = document.getElementById("dnd-portal");
  return el ? createPortal(children, el) : null;
}
