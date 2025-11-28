"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
  employee_id?: string;
}

export function useUserProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    async function fetchProfile(userId: string) {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, phone, department, bio, avatar_url, employee_id")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          if (mounted) {
            setError("Failed to fetch profile");
            setLoading(false);
          }
          return;
        }

        if (mounted && profileData) {
          setProfile(profileData);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("User profile fetch error:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch profile");
          setLoading(false);
        }
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          setLoading(true);
          await fetchProfile(session.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
        setError(null);
        setLoading(false);
      } else if (event === "INITIAL_SESSION") {
        // Initial session check
        if (session?.user) {
          setLoading(true);
          await fetchProfile(session.user.id);
        } else {
          // No session, but wait a bit in case it's still loading
          setTimeout(async () => {
            if (!mounted) return;
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession?.user) {
              setLoading(true);
              await fetchProfile(retrySession.user.id);
            } else {
              setError("Not authenticated");
              setLoading(false);
            }
          }, 1000);
        }
      }
    });

    // Also try to get session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setLoading(true);
        void fetchProfile(session.user.id);
      } else {
        // If no session, wait a bit and check again
        setTimeout(async () => {
          if (!mounted) return;
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession?.user) {
            setLoading(true);
            await fetchProfile(retrySession.user.id);
          } else {
            setError("Not authenticated");
            setLoading(false);
          }
        }, 1000);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Get avatar initials from full name
  const getAvatarInitials = (name: string): string => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0]?.[0]?.toUpperCase() || "U";
  };

  // Get display name (with or without title)
  const getDisplayName = (name: string, includeTitle: boolean = false): string => {
    const parts = name.split(" ").filter(Boolean);
    const titleMatch = parts[0]?.match(/^(Dr|Prof|Professor|Mr|Mrs|Ms)\.?$/i);
    
    if (titleMatch && includeTitle) {
      return parts.slice(0, 2).join(" "); // "Dr. Sarah" or "Prof. John"
    }
    if (titleMatch && !includeTitle) {
      return parts.slice(1).join(" "); // "Sarah Johnson"
    }
    return parts.slice(0, 2).join(" "); // First two words
  };

  return {
    loading,
    error,
    profile,
    getAvatarInitials,
    getDisplayName,
  };
}

