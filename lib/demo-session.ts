/**
 * Demo Session Management
 * Handles session storage for demo users (no login required)
 */

interface DemoSessionData {
  data: any;
  timestamp: number;
  expiresAt: number;
}

interface DemoSession {
  [toolName: string]: DemoSessionData;
}

export class DemoSessionManager {
  private static STORAGE_KEY = 'jobmate_demo_session';
  private static SESSION_DURATION = 60 * 60 * 1000; // 1 hour

  /**
   * Get current demo session
   */
  static getSession(): DemoSession {
    if (typeof window === 'undefined') return {};
    
    try {
      const data = sessionStorage.getItem(this.STORAGE_KEY);
      if (!data) return {};
      
      const session = JSON.parse(data);
      // Clean expired entries
      const now = Date.now();
      Object.keys(session).forEach(key => {
        if (session[key].expiresAt < now) {
          delete session[key];
        }
      });
      
      return session;
    } catch (error) {
      console.error('[DemoSession] Failed to get session:', error);
      return {};
    }
  }

  /**
   * Save draft to session storage
   */
  static saveDraft(toolName: string, data: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      const session = this.getSession();
      session[toolName] = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.SESSION_DURATION
      };
      
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      console.log(`[DemoSession] Saved draft for ${toolName}`);
    } catch (error) {
      console.error('[DemoSession] Failed to save draft:', error);
    }
  }

  /**
   * Get draft for specific tool
   */
  static getDraft(toolName: string): any | null {
    const session = this.getSession();
    const draft = session[toolName];
    
    if (!draft) return null;
    
    // Check if expired
    if (draft.expiresAt < Date.now()) {
      this.deleteDraft(toolName);
      return null;
    }
    
    return draft.data;
  }

  /**
   * Delete draft for specific tool
   */
  static deleteDraft(toolName: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const session = this.getSession();
      delete session[toolName];
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('[DemoSession] Failed to delete draft:', error);
    }
  }

  /**
   * Clear all demo session data
   */
  static clearSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('[DemoSession] Failed to clear session:', error);
    }
  }

  /**
   * Check if user has used any demo tool
   */
  static hasUsedDemo(): boolean {
    const session = this.getSession();
    return Object.keys(session).length > 0;
  }

  /**
   * Get list of tools user has tried
   */
  static getUsedTools(): string[] {
    const session = this.getSession();
    return Object.keys(session);
  }

  /**
   * Track demo usage for analytics
   */
  static trackUsage(toolName: string, action: 'start' | 'complete' | 'export_blocked'): void {
    if (typeof window === 'undefined') return;
    
    // Track with Google Analytics if available
    if ((window as any).gtag) {
      (window as any).gtag('event', `demo_${action}`, {
        tool_name: toolName,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId()
      });
    }
    
    console.log(`[DemoSession] Tracked ${action} for ${toolName}`);
  }

  /**
   * Get or create session ID for tracking
   */
  private static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('jobmate_session_id');
    if (!sessionId) {
      sessionId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('jobmate_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get time remaining before session expires
   */
  static getTimeRemaining(toolName: string): number {
    const session = this.getSession();
    const draft = session[toolName];
    
    if (!draft) return 0;
    
    const remaining = draft.expiresAt - Date.now();
    return Math.max(0, remaining);
  }

  /**
   * Format time remaining as human-readable string
   */
  static formatTimeRemaining(toolName: string): string {
    const ms = this.getTimeRemaining(toolName);
    if (ms === 0) return 'Expired';
    
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes} menit`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours} jam`;
  }
}
