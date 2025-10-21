import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText, Sparkles, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Tools AI - Admin VIP Career',
  description: 'Kumpulan tools AI untuk admin',
};

export default async function AdminToolsAIPage() {
  const supabase = await createClient();

  // Check admin auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const tools = [
    {
      title: 'AI Parser Poster',
      description: 'Upload poster loker dan ekstrak informasi otomatis dengan AI',
      icon: FileText,
      href: '/admin/vip-loker/tambah',
      color: 'from-blue-500 to-cyan-500',
      badge: 'Tersedia',
    },
    {
      title: 'AI Caption Generator',
      description: 'Generate caption menarik untuk WA & Instagram dengan emoji dan hashtag',
      icon: Sparkles,
      href: '/admin/tools-ai/caption',
      color: 'from-purple-500 to-pink-500',
      badge: 'Baru',
    },
    {
      title: 'AI Text Cleaner',
      description: 'Bersihkan format teks dari WA sebelum di-upload ke sistem',
      icon: Copy,
      href: '/admin/tools-ai/cleaner',
      color: 'from-green-500 to-emerald-500',
      badge: 'Coming Soon',
      disabled: true,
    },
    {
      title: 'AI Duplikat Checker',
      description: 'Deteksi loker duplikat dengan membandingkan dengan database',
      icon: CheckCircle,
      href: '/admin/tools-ai/duplicate',
      color: 'from-orange-500 to-red-500',
      badge: 'Coming Soon',
      disabled: true,
    },
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-600" />
            Tools AI Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kumpulan tools AI untuk membantu pekerjaan admin lebih efisien
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isDisabled = tool.disabled;

            return (
              <Card
                key={tool.title}
                className={`hover:shadow-lg transition-all ${
                  isDisabled ? 'opacity-60' : 'cursor-pointer'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        tool.badge === 'Baru'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : tool.badge === 'Coming Soon'
                          ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      }`}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isDisabled ? (
                    <Button disabled className="w-full">
                      Segera Hadir
                    </Button>
                  ) : (
                    <Link href={tool.href}>
                      <Button className={`w-full bg-gradient-to-r ${tool.color}`}>
                        Buka Tool
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Tips Penggunaan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">AI Parser Poster</p>
                <p className="text-sm text-muted-foreground">
                  Upload gambar poster dengan kualitas baik untuk hasil parsing optimal. Format yang disupport: JPG, PNG, WebP
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Caption Generator</p>
                <p className="text-sm text-muted-foreground">
                  Masukkan informasi dasar loker, AI akan generate caption menarik lengkap dengan emoji dan hashtag siap posting
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Produktivitas</p>
                <p className="text-sm text-muted-foreground">
                  Tools ini dapat menghemat waktu hingga 70% dalam proses input loker. Gunakan secara maksimal!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
