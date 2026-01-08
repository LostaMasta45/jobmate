// Types for saved login feature
export interface SavedAccount {
    id: string;           // user id from Supabase
    email: string;
    name: string;
    avatar_url?: string;  // from profiles table
    savedAt: number;      // timestamp when saved
}

// Database row type for saved_accounts table
export interface SavedAccountRow {
    id: string;
    device_id: string;
    user_id: string;
    email: string;
    name: string;
    avatar_url?: string;
    saved_at: string;
    updated_at: string;
}

export interface LoginData {
    user: {
        id: string;
        email: string;
    };
    profile: {
        full_name: string;
        avatar_url?: string;
        role?: string;
        membership?: string;
    };
}

