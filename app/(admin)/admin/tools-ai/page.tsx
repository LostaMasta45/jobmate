import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, FileText, Sparkles, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Tools - Admin VIP Career',
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
      badge: 'Available',
    },
    {
      title: 'AI Caption Generator',
      description: 'Generate caption menarik untuk WA & Instagram dengan emoji dan hashtag',
      icon: Sparkles,
      href: '/admin/tools-ai/caption',
      color: 'from-purple-500 to-pink-500',
      badge: 'New',
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
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-600" />
            Admin AI Tools
          </h1>
          <p className="text-muted-foreground mt-2">
            Suite of AI-powered tools to automate admin tasks and boost productivity.
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
                className={`border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm group ${
                  isDisabled ? 'opacity-60' : 'cursor-pointer'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold shadow-sm ${
                        tool.badge === 'New'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : tool.badge === 'Coming Soon'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}
                    >
                      {tool.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isDisabled ? (
                    <Button disabled className="w-full" variant="secondary">
                      Coming Soon
                    </Button>
                  ) : (
                    <Link href={tool.href} className="w-full block">
                      <Button className={`w-full bg-gradient-to-r ${tool.color} shadow-md hover:shadow-lg transition-all`}>
                        Launch Tool
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips Section */}
        <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              💡 Usage Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium text-sm">AI Parser Poster</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload high-quality images (JPG, PNG, WebP) for best results. The AI extracts company name, role, and requirements automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Caption Generator</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Input basic job details and let AI generate engaging captions with optimized hashtags for social media reach.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Productivity Boost</p>
                <p className="text-sm text-muted-foreground mt-1">
                  These tools are designed to cut down manual data entry by up to 70%. Use them to focus on verification and quality control.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
