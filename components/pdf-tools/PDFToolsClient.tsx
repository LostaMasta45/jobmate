"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MergeTool } from "./tools/MergeTool";
import { CompressTool } from "./tools/CompressTool";
import { ConvertTool } from "./tools/ConvertTool";
import { PDFHistory } from "./PDFHistory";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { PDFHome } from "./PDFHome";
import { motion, AnimatePresence } from "framer-motion";

type ToolType = 'home' | 'merge' | 'compress' | 'convert' | 'history';

export function PDFToolsClient() {
  const [activeTool, setActiveTool] = useState<ToolType>('home');

  const renderTool = () => {
    switch (activeTool) {
      case 'merge':
        return <MergeTool onBack={() => setActiveTool('home')} />;
      case 'compress':
        return <CompressTool onBack={() => setActiveTool('home')} />;
      case 'convert':
        return <ConvertTool onBack={() => setActiveTool('home')} />;
      case 'history':
        return <PDFHistory onBack={() => setActiveTool('home')} />;
      default:
        return null;
    }
  };

  return (
    <>
      {activeTool === 'home' && (
        <MobileToolHeader
          title="PDF Tools"
          description="Kelola dokumen PDF"
        />
      )}

      <AnimatePresence mode="wait">
        {activeTool === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full overflow-y-auto"
          >
            <PDFHome onSelectTool={setActiveTool} />
          </motion.div>
        ) : (
          <motion.div
            key="tool"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full w-full overflow-y-auto md:overflow-hidden bg-slate-50 dark:bg-[#050505]"
          >
            {/* Tool Content - Direct Render without extra wrapper */}
            {renderTool()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
