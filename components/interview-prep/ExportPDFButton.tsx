"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { InterviewPrepSession } from "@/types/interview-prep";
import { jsPDF } from "jspdf";

interface ExportPDFButtonProps {
  session: InterviewPrepSession;
}

export function ExportPDFButton({ session }: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add new page if needed
      const checkAddPage = (requiredSpace: number = 20) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper function to wrap text
      const addWrappedText = (
        text: string,
        fontSize: number,
        fontStyle: "normal" | "bold" = "normal",
        maxW = maxWidth
      ) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", fontStyle);
        const lines = doc.splitTextToSize(text, maxW);
        
        lines.forEach((line: string) => {
          checkAddPage();
          doc.text(line, margin, yPosition);
          yPosition += fontSize * 0.5;
        });
        
        return lines.length;
      };

      // Title
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Interview Preparation", margin, 15);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`${session.position}`, margin, 25);
      doc.text(`${session.company_name}`, margin, 32);

      yPosition = 50;
      doc.setTextColor(0, 0, 0);

      // Summary
      doc.setFillColor(240, 240, 240);
      doc.rect(margin - 5, yPosition - 5, maxWidth + 10, 30, "F");
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("📊 Ringkasan", margin, yPosition + 3);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPosition += 10;
      doc.text(`Match Score: ${session.match_score}%`, margin, yPosition);
      doc.text(`Total Pertanyaan: ${session.questions.length}`, margin + 60, yPosition);
      yPosition += 7;
      doc.text(`High Priority: ${session.high_priority_count}`, margin, yPosition);
      doc.text(`Dibuat: ${new Date(session.created_at).toLocaleDateString('id-ID')}`, margin + 60, yPosition);
      
      yPosition += 15;

      // Strengths
      if (session.strengths && session.strengths.length > 0) {
        checkAddPage(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(34, 197, 94);
        doc.text("✅ Kekuatan Anda", margin, yPosition);
        yPosition += 7;
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        session.strengths.slice(0, 5).forEach((strength) => {
          checkAddPage();
          doc.text(`• ${strength}`, margin + 3, yPosition);
          yPosition += 5;
        });
        yPosition += 5;
      }

      // Gaps
      if (session.gaps && session.gaps.length > 0) {
        checkAddPage(30);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(239, 68, 68);
        doc.text("⚠️ Gap yang Perlu Dipersiapkan", margin, yPosition);
        yPosition += 7;
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        session.gaps.slice(0, 5).forEach((gap) => {
          checkAddPage();
          doc.text(`• ${gap}`, margin + 3, yPosition);
          yPosition += 5;
        });
        yPosition += 10;
      }

      // Questions
      session.questions.forEach((question, index) => {
        checkAddPage(50);

        // Question Header
        doc.setFillColor(250, 250, 250);
        doc.rect(margin - 5, yPosition - 3, maxWidth + 10, 10, "F");
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`P${index + 1}. [${question.category.toUpperCase()}]`, margin, yPosition + 3);
        yPosition += 12;

        // Question Text
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 138);
        addWrappedText(question.question, 10, "bold");
        yPosition += 3;

        // Reasoning
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text("💡 Kenapa penting:", margin, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        addWrappedText(question.reasoning, 9, "normal");
        yPosition += 3;

        // Basic Answer
        checkAddPage(20);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Jawaban Singkat:", margin, yPosition);
        yPosition += 5;
        doc.setFont("helvetica", "normal");
        const basicAnswer = question.basic_answer || question.answers?.basic || "Tidak ada jawaban";
        addWrappedText(basicAnswer, 9, "normal");
        yPosition += 3;

        // STAR Answer (for behavioral/situational)
        if ((question.category === 'behavioral' || question.category === 'situational') && 
            (question.star_answer || question.answers?.star?.full)) {
          checkAddPage(30);
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(217, 119, 6);
          doc.text("⭐ Jawaban STAR (Situasi-Task-Action-Result):", margin, yPosition);
          yPosition += 5;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          const starAnswer = question.star_answer || question.answers?.star?.full || "";
          addWrappedText(starAnswer, 9, "normal");
          yPosition += 3;
        }

        // Tips
        if (question.tips && question.tips.length > 0) {
          checkAddPage(15);
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(34, 197, 94);
          doc.text("💡 Tips:", margin, yPosition);
          yPosition += 5;
          doc.setFont("helvetica", "normal");
          question.tips.slice(0, 3).forEach((tip) => {
            checkAddPage();
            const tipLines = doc.splitTextToSize(`• ${tip}`, maxWidth - 5);
            tipLines.forEach((line: string) => {
              doc.text(line, margin + 2, yPosition);
              yPosition += 4;
            });
          });
          yPosition += 2;
        }

        // Red Flags
        if (question.red_flags && question.red_flags.length > 0) {
          checkAddPage(15);
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(239, 68, 68);
          doc.text("🚫 Hindari:", margin, yPosition);
          yPosition += 5;
          doc.setFont("helvetica", "normal");
          question.red_flags.slice(0, 3).forEach((flag) => {
            checkAddPage();
            const flagLines = doc.splitTextToSize(`• ${flag}`, maxWidth - 5);
            flagLines.forEach((line: string) => {
              doc.text(line, margin + 2, yPosition);
              yPosition += 4;
            });
          });
          yPosition += 2;
        }

        yPosition += 8; // Space between questions
      });

      // Footer on last page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Generated by JobMate Interview Prep • Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      // Save PDF
      const fileName = `Interview-Prep-${session.position.replace(/\s+/g, "-")}-${Date.now()}.pdf`;
      doc.save(fileName);

      setIsExporting(false);
    } catch (error) {
      console.error("Export PDF error:", error);
      alert("Gagal export PDF. Silakan coba lagi.");
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToPDF}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}
