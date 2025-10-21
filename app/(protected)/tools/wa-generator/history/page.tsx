"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Search, Copy, MessageCircle, Trash2, ChevronRight, Check, Plus, ArrowLeft, Sparkles } from "lucide-react";
import { getWAMessages, getWAStats } from "@/actions/whatsapp/list";
import { deleteWAMessage } from "@/actions/whatsapp/delete";
import { markAsSent, incrementCopyCount } from "@/actions/whatsapp/save";
import { spintax } from "@/lib/spintax";
import { toast } from "sonner";
import Link from "next/link";

const MESSAGE_TYPE_LABELS: Record<string, string> = {
  application: "📝 Application",
  follow_up: "🔄 Follow-Up",
  interview_confirmation: "✅ Interview Confirm",
  thank_you: "🙏 Thank You",
  status_inquiry: "❓ Status Inquiry",
  re_application: "🔁 Re-Application",
  referral: "👥 Referral"
};

export default function WAHistoryPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
    loadStats();
  }, [filter]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const result = await getWAMessages({
        messageType: filter === "all" ? undefined : filter,
        limit: 50
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setMessages(result.data || []);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast.error('Gagal memuat history');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getWAStats();
      if (!result.error) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCopy = async (message: any, usePlain: boolean = false) => {
    const textToCopy = usePlain 
      ? (message.plain_content || spintax.resolve(message.content))
      : message.content;
    
    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 2000);
    
    // Increment copy count
    await incrementCopyCount(message.id);
    
    toast.success('Pesan berhasil disalin! 📋');
  };

  const handleSendWhatsApp = async (message: any) => {
    const textToSend = message.plain_content || spintax.resolve(message.content);
    const encodedMessage = encodeURIComponent(textToSend);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    
    // Mark as sent
    await markAsSent(message.id);
    await loadMessages(); // Reload to update status
    
    toast.success('Membuka WhatsApp... 📱');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pesan ini?')) return;

    try {
      const result = await deleteWAMessage(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Pesan berhasil dihapus');
      await loadMessages();
      await loadStats();
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error('Gagal menghapus pesan');
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      msg.company_name?.toLowerCase().includes(search) ||
      msg.position?.toLowerCase().includes(search) ||
      msg.content?.toLowerCase().includes(search)
    );
  });

  return (
    <AppShell>
      {/* Navigation Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/tools/wa-generator">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">WhatsApp History</h1>
            <p className="text-sm text-muted-foreground">
              Lihat dan kelola semua pesan yang sudah di-generate
            </p>
          </div>
        </div>
        <Link href="/tools/wa-generator">
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
            Buat Pesan Baru
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total Pesan
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.sent}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Terkirim
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.draft}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Draft
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {MESSAGE_TYPE_LABELS[stats.mostUsedType]?.split(' ')[0] || '📝'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Paling Sering
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari perusahaan, posisi, atau konten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="follow_up">Follow-Up</SelectItem>
                <SelectItem value="interview_confirmation">Interview Confirm</SelectItem>
                <SelectItem value="thank_you">Thank You</SelectItem>
                <SelectItem value="status_inquiry">Status Inquiry</SelectItem>
                <SelectItem value="re_application">Re-Application</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading...
          </CardContent>
        </Card>
      ) : filteredMessages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto">
              {searchTerm ? (
                <>
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Tidak ada hasil</h3>
                  <p className="text-muted-foreground mb-6">
                    Tidak ada pesan yang cocok dengan pencarian "{searchTerm}"
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Hapus Filter
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative mb-6">
                    <Sparkles className="h-16 w-16 mx-auto text-green-600 dark:text-green-400 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Belum ada pesan tersimpan</h3>
                  <p className="text-muted-foreground mb-6">
                    Mulai generate pesan WhatsApp profesional untuk lamaran kerja Anda
                  </p>
                  <Link href="/tools/wa-generator">
                    <Button className="gap-2 bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4" />
                      Buat Pesan Pertama
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {message.company_name}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      {message.position}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        {MESSAGE_TYPE_LABELS[message.message_type] || message.message_type}
                      </Badge>
                      <Badge variant={message.status === 'sent' ? 'default' : 'outline'}>
                        {message.status === 'sent' ? '✓ Terkirim' : '📝 Draft'}
                      </Badge>
                      {message.tone_style && (
                        <Badge variant="outline" className="text-xs">
                          {message.tone_style}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Message Preview */}
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[85%]">
                    <p className="text-sm whitespace-pre-wrap line-clamp-4">
                      {message.content}
                    </p>
                    {message.spintax_count > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {message.spintax_count} variasi spintax
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div>📊 {message.word_count} kata</div>
                  <div>📝 {message.char_count} karakter</div>
                  {message.times_copied > 0 && (
                    <div>📋 Disalin {message.times_copied}x</div>
                  )}
                  {message.hrd_name && (
                    <div>👤 HRD: {message.hrd_name}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(message, false)}
                    className="flex-1 sm:flex-none"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(message, true)}
                    className="flex-1 sm:flex-none"
                  >
                    Copy Plain
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSendWhatsApp(message)}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Kirim WA
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Quick Action Card at Bottom */}
          {filteredMessages.length > 0 && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <CardContent className="py-8 text-center">
                <h3 className="font-semibold mb-2">Perlu pesan baru?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate pesan WhatsApp untuk lamaran atau follow-up lainnya
                </p>
                <Link href="/tools/wa-generator">
                  <Button className="gap-2 bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4" />
                    Buat Pesan Baru
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </AppShell>
  );
}
