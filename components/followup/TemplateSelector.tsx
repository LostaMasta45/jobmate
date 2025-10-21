"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, 
  MessageCircle, 
  Linkedin, 
  Phone, 
  Copy, 
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Loader2,
  Wand2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FollowUpTemplate, TemplateVariables, FollowUpChannel } from "@/types/followup";
import { getFollowUpTemplates } from "@/actions/followup/templates";
import { CHANNEL_CONFIG, fillTemplateVariables } from "@/lib/followup-utils";
import { generateFollowUpMessage, getAvailableLanguages, type FollowUpLanguage } from "@/actions/followup/ai-generate";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variables: Partial<TemplateVariables>;
  reminderType?: 'first_followup' | 'second_followup' | 'third_followup' | 'post_interview_thankyou' | 'post_interview_followup';
  onSend: (channel: FollowUpChannel, subject: string | undefined, body: string) => void;
}

export function TemplateSelector({
  open,
  onOpenChange,
  variables,
  reminderType = 'first_followup',
  onSend,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<FollowUpTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FollowUpTemplate | null>(null);
  const [channel, setChannel] = useState<FollowUpChannel>("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [language, setLanguage] = useState<FollowUpLanguage>('id-formal');
  const [availableLanguages, setAvailableLanguages] = useState<{ value: FollowUpLanguage; label: string }[]>([]);

  useEffect(() => {
    if (open) {
      loadTemplates();
      loadLanguages();
    }
  }, [open, channel]);

  const loadLanguages = async () => {
    const langs = await getAvailableLanguages();
    setAvailableLanguages(langs);
  };

  useEffect(() => {
    if (selectedTemplate) {
      applyTemplate(selectedTemplate);
    }
  }, [selectedTemplate, variables]);

  const loadTemplates = async () => {
    setLoading(true);
    const result = await getFollowUpTemplates(undefined, channel);
    if (result.data) {
      setTemplates(result.data);
      if (result.data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(result.data[0]);
      }
    }
    setLoading(false);
  };

  const applyTemplate = (template: FollowUpTemplate) => {
    const filledBody = fillTemplateVariables(template.message_body, variables);
    const filledSubject = template.subject_line
      ? fillTemplateVariables(template.subject_line, variables)
      : "";

    setBody(filledBody);
    setSubject(filledSubject);
  };

  const handleCopy = () => {
    const text = subject ? `Subject: ${subject}\n\n${body}` : body;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleSend = () => {
    if (!body.trim()) {
      toast.error("Message body cannot be empty");
      return;
    }
    onSend(channel, subject || undefined, body);
    onOpenChange(false);
  };

  const handleGenerateAI = async () => {
    if (!variables.company || !variables.position || !variables.applied_date) {
      toast.error("Missing application details");
      return;
    }

    // Don't allow AI generation for phone/linkedin channel
    if (channel !== 'email' && channel !== 'whatsapp') {
      toast.error("AI generation is only available for email and WhatsApp");
      return;
    }

    setGenerating(true);
    toast.info("Generating AI message...");

    const result = await generateFollowUpMessage({
      company: variables.company,
      position: variables.position,
      appliedDate: variables.applied_date,
      reminderType,
      channel,
      language,
      userAchievements: variables.skills,
      specificTopics: variables.specific_topic_discussed,
    });

    setGenerating(false);

    if (result.error) {
      toast.error(`Failed: ${result.error}`);
      return;
    }

    if (result.data) {
      setBody(result.data.body);
      if (result.data.subject && channel === 'email') {
        setSubject(result.data.subject);
      }
      toast.success(`AI message generated! (${result.data.language})`);
    }
  };

  const ChannelIcon = {
    email: Mail,
    whatsapp: MessageCircle,
    linkedin: Linkedin,
    phone: Phone,
  }[channel];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Follow-up Message Templates
          </DialogTitle>
          <DialogDescription>
            Choose a template and customize your follow-up message
          </DialogDescription>
        </DialogHeader>

        <Tabs value={channel} onValueChange={(v) => setChannel(v as FollowUpChannel)} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between gap-4 mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={(v) => setLanguage(v as FollowUpLanguage)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleGenerateAI}
                disabled={generating}
                variant="default"
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    AI Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden mt-4">
            {/* Templates List */}
            <ScrollArea className="col-span-1 border rounded-lg">
              <div className="p-3 space-y-2">
                {loading ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Loading templates...
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No templates found
                  </div>
                ) : (
                  templates.map((template) => (
                    <Card
                      key={template.id}
                      className={cn(
                        "cursor-pointer transition-all hover:border-primary",
                        selectedTemplate?.id === template.id && "border-primary bg-primary/5"
                      )}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          {template.is_system && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              System
                            </Badge>
                          )}
                        </div>
                        {template.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                        )}
                        {template.usage_count > 0 && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Used {template.usage_count} times
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Preview & Edit */}
            <div className="col-span-2 space-y-3">
              {CHANNEL_CONFIG[channel].supportsSubject && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter subject line..."
                  />
                </div>
              )}

              <div className="space-y-2 flex-1">
                <Label htmlFor="body">Message Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter your message..."
                  className="min-h-[300px] resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {body.length} characters
                </p>
              </div>

              {/* Preview Info */}
              <Card className="bg-accent/50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2 text-xs">
                    <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ChannelIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">
                        Sending via {CHANNEL_CONFIG[channel].label}
                      </p>
                      <p className="text-muted-foreground">
                        {channel === "email" && variables.hrd_email && `To: ${variables.hrd_email}`}
                        {channel === "whatsapp" && variables.hrd_phone && `To: ${variables.hrd_phone}`}
                        {channel === "linkedin" && "Via LinkedIn messaging"}
                        {channel === "phone" && variables.hrd_phone && `Call: ${variables.hrd_phone}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Mark as Sent
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
