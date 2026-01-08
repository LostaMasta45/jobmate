"use client";

import { useState, useEffect, useCallback } from 'react';
import { SavedAccount, SavedAccountRow } from '@/types/saved-account';
import { createClient } from '@/lib/supabase/client';

const DEVICE_ID_KEY = 'jobmate_device_id';
const MAX_ACCOUNTS = 5;

// Generate a unique device ID
function getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return '';

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
}

// Convert database row to SavedAccount
function rowToAccount(row: SavedAccountRow): SavedAccount {
    return {
        id: row.user_id,
        email: row.email,
        name: row.name,
        avatar_url: row.avatar_url,
        savedAt: new Date(row.saved_at).getTime(),
    };
}

export function useSavedAccounts() {
    const [accounts, setAccounts] = useState<SavedAccount[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [deviceId, setDeviceId] = useState<string>('');

    // Initialize device ID and load saved accounts on mount
    useEffect(() => {
        const id = getOrCreateDeviceId();
        setDeviceId(id);

        if (id) {
            loadAccountsFromSupabase(id);
        }
    }, []);

    // Load saved accounts from Supabase
    const loadAccountsFromSupabase = async (devId: string) => {
        try {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('saved_accounts')
                .select('*')
                .eq('device_id', devId)
                .order('saved_at', { ascending: false })
                .limit(MAX_ACCOUNTS);

            if (error) {
                console.error('Error loading saved accounts:', error);
                setIsLoaded(true);
                return;
            }

            if (data) {
                const savedAccounts = data.map(rowToAccount);
                setAccounts(savedAccounts);
            }
        } catch (error) {
            console.error('Error loading saved accounts:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    // Save account to Supabase
    const saveAccount = useCallback(async (account: SavedAccount) => {
        if (!deviceId) return;

        try {
            const supabase = createClient();

            // Upsert the account (insert or update if exists)
            const { error } = await supabase
                .from('saved_accounts')
                .upsert({
                    device_id: deviceId,
                    user_id: account.id,
                    email: account.email,
                    name: account.name,
                    avatar_url: account.avatar_url || null,
                    saved_at: new Date(account.savedAt).toISOString(),
                }, {
                    onConflict: 'device_id,user_id',
                });

            if (error) {
                console.error('Error saving account:', error);
                return;
            }

            // Update local state
            setAccounts((prev) => {
                const updated = [
                    account,
                    ...prev.filter((a) => a.id !== account.id),
                ].slice(0, MAX_ACCOUNTS);
                return updated;
            });
        } catch (error) {
            console.error('Error saving account:', error);
        }
    }, [deviceId]);

    // Remove account from Supabase
    const removeAccount = useCallback(async (id: string) => {
        if (!deviceId) return;

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('saved_accounts')
                .delete()
                .eq('device_id', deviceId)
                .eq('user_id', id);

            if (error) {
                console.error('Error removing account:', error);
                return;
            }

            // Update local state
            setAccounts((prev) => prev.filter((a) => a.id !== id));
        } catch (error) {
            console.error('Error removing account:', error);
        }
    }, [deviceId]);

    // Clear all saved accounts for this device
    const clearAll = useCallback(async () => {
        if (!deviceId) return;

        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('saved_accounts')
                .delete()
                .eq('device_id', deviceId);

            if (error) {
                console.error('Error clearing accounts:', error);
                return;
            }

            setAccounts([]);
        } catch (error) {
            console.error('Error clearing accounts:', error);
        }
    }, [deviceId]);

    // Check if an account is already saved
    const isAccountSaved = useCallback(
        (id: string) => accounts.some((a) => a.id === id),
        [accounts]
    );

    return {
        accounts,
        isLoaded,
        saveAccount,
        removeAccount,
        clearAll,
        isAccountSaved,
        hasSavedAccounts: accounts.length > 0,
    };
}
