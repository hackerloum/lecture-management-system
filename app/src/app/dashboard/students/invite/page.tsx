"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Link as LinkIcon,
  Users,
  RefreshCw,
  Mail,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface PendingRegistration {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  major: string | null;
  year: string | null;
  student_id: string | null;
  submittedAt: string;
  status: string;
}

export default function StudentInvitePage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInvitation, setCurrentInvitation] = useState<any>(null);
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);

  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();
    
    async function fetchInvitationData() {
      // Prevent multiple simultaneous fetches
      if (!isMounted) return;
      
      try {
        setLoading(true);
        setError(null);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          if (isMounted) {
            setError("Not authenticated. Please sign in again.");
            setLoading(false);
          }
          return;
        }

        // Get user's profile and organization
        let { data: profile } = await supabase
          .from("profiles")
          .select("organization_id, full_name, email")
          .eq("id", user.id)
          .single();

        if (!profile) {
          throw new Error("Profile not found");
        }

        // If user doesn't have an organization, create one
        let organizationId = profile.organization_id;
        
        if (!organizationId) {
          // Create a default organization for this user using database function
          const emailDomain = profile.email?.split("@")[1] || "university.edu";
          const orgName = `${profile.full_name || "My"}'s Institution`;
          const orgSlug = `${profile.full_name?.toLowerCase().replace(/\s+/g, "-") || "institution"}-${Date.now().toString(36)}`;

          console.log("Attempting to create organization:", { orgName, orgSlug, email: profile.email });

          // Try using the database function first (if it exists)
          const { data: functionResult, error: functionError } = await supabase.rpc(
            'create_user_organization',
            {
              p_user_id: user.id,
              p_org_name: orgName,
              p_org_slug: orgSlug,
              p_org_email: profile.email || '',
            }
          );

          if (!functionError && functionResult) {
            // Function worked!
            organizationId = functionResult;
            console.log("Organization created via function:", organizationId);
          } else {
            // Fallback to direct insert if function doesn't exist
            console.log("Function not available, trying direct insert...", functionError);
            
            const { data: newOrg, error: orgError } = await supabase
              .from("organizations")
              .insert({
                name: orgName,
                slug: orgSlug,
                email: profile.email,
              })
              .select()
              .single();

            if (orgError) {
              // Log full error details for debugging
              console.error("Organization creation error details:", {
                message: orgError.message,
                details: orgError.details,
                hint: orgError.hint,
                code: orgError.code,
                status: orgError.status,
              });

              // Check if it's an RLS policy issue
              const errorMessage = orgError.message || "";
              const errorCode = orgError.code || "";
              const statusCode = orgError.status || 0;
              
              if (statusCode === 403 || errorMessage.includes("policy") || errorMessage.includes("permission") || errorCode === "42501" || errorCode === "PGRST301") {
                throw new Error("Permission denied (403): Please run the SQL script 'fix_organization_creation.sql' in Supabase to create the database function, or update the RLS policy to use 'auth.uid() IS NOT NULL' instead of 'auth.role() = authenticated'.");
              }
              
              // Check if slug already exists
              if (errorMessage.includes("duplicate") || errorMessage.includes("unique") || errorCode === "23505") {
                // Try again with a more unique slug
                const retrySlug = `${orgSlug}-${Math.random().toString(36).substring(2, 9)}`;
                const { data: retryOrg, error: retryError } = await supabase
                  .from("organizations")
                  .insert({
                    name: orgName,
                    slug: retrySlug,
                    email: profile.email,
                  })
                  .select()
                  .single();
                
                if (retryError) {
                  console.error("Retry organization creation error:", retryError);
                  throw new Error(`Failed to create organization: ${retryError.message || retryError.code || "Slug conflict, please try again"}`);
                }
                if (!retryOrg) {
                  throw new Error("Failed to create organization: No data returned on retry");
                }
                organizationId = retryOrg.id;
              } else {
                // Provide more detailed error message
                const detailedError = errorMessage || errorCode || `Status: ${statusCode}`;
                throw new Error(`Failed to create organization: ${detailedError}. Please check the browser console for more details.`);
              }
            } else if (!newOrg) {
              throw new Error("Failed to create organization: No data returned");
            } else {
              organizationId = newOrg.id;
            }

            // Update user's profile to link to the new organization
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ organization_id: organizationId })
              .eq("id", user.id);

            if (updateError) {
              console.error("Error updating profile with organization:", updateError);
              throw new Error(`Failed to link organization to profile: ${updateError.message || updateError.code || "Unknown error"}`);
            }
          }

          // Wait a moment for the update to propagate (RLS policies need the profile to be updated)
          await new Promise(resolve => setTimeout(resolve, 500));

          // Refresh profile data to ensure it's updated
          const { data: updatedProfile, error: refreshError } = await supabase
            .from("profiles")
            .select("organization_id, full_name")
            .eq("id", user.id)
            .single();

          if (refreshError) {
            console.error("Error refreshing profile:", refreshError);
            // Continue anyway - we have the organization ID
          } else if (updatedProfile) {
            profile = updatedProfile;
            // Verify the organization_id was set
            if (!updatedProfile.organization_id) {
              throw new Error("Profile organization_id was not updated. Please try again.");
            }
          }
        }

        // Ensure we have organizationId from profile (for RLS policy check)
        if (!organizationId) {
          // Try to get it from profile again
          const { data: currentProfile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", user.id)
            .single();
          
          if (currentProfile?.organization_id) {
            organizationId = currentProfile.organization_id;
          } else {
            throw new Error("Organization ID not found. Please refresh the page and try again.");
          }
        }

        // Find or create a general student invitation for this organization
        // Look for existing pending invitation
        const { data: existingInvitations, error: fetchInvError } = await supabase
          .from("invitations")
          .select("*")
          .eq("organization_id", organizationId)
          .eq("role", "student")
          .is("course_id", null) // General invitation, not course-specific
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1);

        if (fetchInvError) {
          console.error("Error fetching existing invitations:", {
            message: fetchInvError.message,
            details: fetchInvError.details,
            hint: fetchInvError.hint,
            code: fetchInvError.code,
          });
          throw new Error(`Failed to fetch invitations: ${fetchInvError.message || fetchInvError.code || "Please check RLS policies for invitations table."}`);
        }

        let invitation = existingInvitations?.[0];

        // If no invitation exists, create one
        if (!invitation) {
          const expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Expires in 1 year

          // Try using the database function first (bypasses RLS)
          console.log("Attempting to create invitation via function with params:", {
            p_organization_id: organizationId,
            p_email: "",
            p_role: "student",
            p_invited_by: user.id,
            p_expires_at: expiresAt.toISOString(),
          });
          
          // Add timeout to RPC call to prevent hanging
          const rpcPromise = supabase.rpc(
            "create_invitation",
            {
              p_organization_id: organizationId,
              p_email: "", // Empty email means open invitation
              p_role: "student",
              p_invited_by: user.id,
              p_expires_at: expiresAt.toISOString(),
            }
          );
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("RPC call timed out after 10 seconds")), 10000)
          );
          
          let functionInvitation, functionError;
          try {
            const result = await Promise.race([rpcPromise, timeoutPromise]) as any;
            functionInvitation = result.data;
            functionError = result.error;
          } catch (timeoutError) {
            console.error("RPC call timed out:", timeoutError);
            functionError = timeoutError as any;
            functionInvitation = null;
          }

          console.log("Function response:", { functionInvitation, functionError });

          if (!functionError && functionInvitation) {
            // Handle both array and single object returns
            invitation = Array.isArray(functionInvitation) 
              ? functionInvitation[0] 
              : functionInvitation;
            console.log("Invitation created via function:", invitation);
            
            // Verify invitation has required fields
            if (!invitation || !invitation.id || !invitation.token) {
              console.error("Invalid invitation returned from function:", invitation);
              throw new Error("Invalid invitation data returned from database function. Missing id or token.");
            }
          } else {
            // Fallback to direct insert if function doesn't exist
            console.warn("Database function not available, trying direct insert:", functionError);
            
            const token = `inv_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
            const { data: newInvitation, error: createError } = await supabase
              .from("invitations")
              .insert({
                organization_id: organizationId,
                email: "", // Empty email means open invitation
                token,
                role: "student",
                invited_by: user.id,
                expires_at: expiresAt.toISOString(),
                status: "pending",
              })
              .select()
              .single();

            if (createError) {
              console.error("Error creating invitation:", createError);
              throw new Error(`Failed to create invitation: ${createError.message || createError.code || "RLS policy may be missing. Please add RLS policies for invitations table."}`);
            }

            if (!newInvitation) {
              throw new Error("Failed to create invitation: No data returned");
            }

            invitation = newInvitation;
          }
        }

        // Verify invitation has token before proceeding
        if (!invitation || !invitation.token) {
          console.error("Invalid invitation object:", invitation);
          throw new Error("Invitation is missing required token field");
        }

        setCurrentInvitation(invitation);

        // Generate the full invite link
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        setInviteLink(`${baseUrl}/register/${invitation.token}`);

        // Fetch pending registrations (invitations that have been used but not yet accepted)
        // We'll look for profiles with role='student' that were created via invitation
        // For now, we'll show invitations that have been accepted but the student profile might be pending
        // Actually, let's show invitations with status='pending' that have an email (meaning someone registered)
        try {
          const { data: usedInvitations, error: usedInvError } = await supabase
            .from("invitations")
            .select("*")
            .eq("organization_id", organizationId)
            .eq("role", "student")
            .neq("email", "")
            .in("status", ["pending", "accepted"])
            .order("created_at", { ascending: false });

          if (usedInvError) {
            console.error("Error fetching used invitations:", usedInvError);
            // Don't throw - just log and continue with empty list
            setPendingRegistrations([]);
          } else if (usedInvitations && usedInvitations.length > 0) {
            // Use Promise.allSettled to prevent hanging if one profile fetch fails
            const registrationPromises = usedInvitations.map(async (inv) => {
              try {
                // Get the profile if it exists
                const { data: studentProfile } = await supabase
                  .from("profiles")
                  .select("full_name, phone, major, year, student_id, created_at")
                  .eq("email", inv.email)
                  .eq("role", "student")
                  .single();

                const createdDate = studentProfile?.created_at || inv.created_at;
                const now = new Date();
                const created = new Date(createdDate);
                const diffMs = now.getTime() - created.getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);

                let submittedAt = "";
                if (diffHours < 1) submittedAt = "Just now";
                else if (diffHours < 24) submittedAt = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
                else submittedAt = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

                return {
                  id: inv.id,
                  email: inv.email,
                  full_name: studentProfile?.full_name || inv.email.split("@")[0],
                  phone: studentProfile?.phone || null,
                  major: studentProfile?.major || null,
                  year: studentProfile?.year || null,
                  student_id: studentProfile?.student_id || null,
                  submittedAt,
                  status: inv.status,
                };
              } catch (profileError) {
                console.error(`Error fetching profile for ${inv.email}:`, profileError);
                // Return a basic registration object even if profile fetch fails
                return {
                  id: inv.id,
                  email: inv.email,
                  full_name: inv.email.split("@")[0],
                  phone: null,
                  major: null,
                  year: null,
                  student_id: null,
                  submittedAt: "Unknown",
                  status: inv.status,
                };
              }
            });

            const results = await Promise.allSettled(registrationPromises);
            const registrations: PendingRegistration[] = results
              .filter((result): result is PromiseFulfilledResult<PendingRegistration> => result.status === "fulfilled")
              .map((result) => result.value);

            setPendingRegistrations(registrations);
          } else {
            setPendingRegistrations([]);
          }
        } catch (pendingError) {
          console.error("Error processing pending registrations:", pendingError);
          // Don't throw - just set empty array and continue
          setPendingRegistrations([]);
        }

        console.log("Successfully completed fetchInvitationData");
      } catch (err) {
        console.error("Error fetching invitation data:", err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load invitation data";
          setError(errorMessage);
        }
      } finally {
        // Always clear loading state, even if component unmounts
        if (isMounted) {
          setLoading(false);
        } else {
          // Force clear if unmounted (safety net)
          setTimeout(() => setLoading(false), 0);
        }
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.error("Fetch invitation data timed out");
        setError("Request timed out. Please refresh the page and try again.");
        setLoading(false);
      }
      abortController.abort();
    }, 15000); // 15 second timeout (reduced from 30)

    // Execute fetch with abort signal
    fetchInvitationData().finally(() => {
      clearTimeout(timeoutId);
      if (isMounted) {
        // Ensure loading is always cleared
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      abortController.abort();
      clearTimeout(timeoutId);
      // Force clear loading state on unmount
      setLoading(false);
    };
  }, []); // Empty dependency array - only run once on mount

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const regenerateLink = async () => {
    try {
      setRegenerating(true);
      const supabase = createSupabaseBrowserClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, email, full_name")
        .eq("id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      // If user doesn't have an organization, create one
      let organizationId = profile.organization_id;
      
      if (!organizationId) {
        const orgName = `${profile.full_name || "My"}'s Institution`;
        const orgSlug = `${profile.full_name?.toLowerCase().replace(/\s+/g, "-") || "institution"}-${Date.now().toString(36)}`;

        // Try using the database function first (bypasses RLS)
        const { data: functionOrgId, error: functionError } = await supabase.rpc(
          "create_user_organization",
          {
            p_user_id: user.id,
            p_org_name: orgName,
            p_org_slug: orgSlug,
            p_org_email: profile.email || "",
          }
        );

        if (!functionError && functionOrgId) {
          organizationId = functionOrgId;
          console.log("Organization created via function:", organizationId);
        } else {
          // Fallback to direct insert if function doesn't exist
          console.warn("Database function not available, trying direct insert:", functionError);
          
          const { data: newOrg, error: orgError } = await supabase
            .from("organizations")
            .insert({
              name: orgName,
              slug: orgSlug,
              email: profile.email,
            })
            .select()
            .single();

          if (orgError) {
            console.error("Organization creation error details:", {
              message: orgError.message,
              details: orgError.details,
              hint: orgError.hint,
              code: orgError.code,
            });

            const errorMessage = orgError.message || "";
            const errorCode = orgError.code || "";
            
            if (errorMessage.includes("policy") || errorMessage.includes("permission") || errorCode === "42501" || errorCode === "PGRST301") {
              throw new Error("Permission denied: The RLS policy may not be set up correctly. Please verify the SQL fix was applied correctly in Supabase.");
            }
            
            if (errorMessage.includes("duplicate") || errorMessage.includes("unique") || errorCode === "23505") {
              const retrySlug = `${orgSlug}-${Math.random().toString(36).substring(2, 9)}`;
              const { data: retryOrg, error: retryError } = await supabase
                .from("organizations")
                .insert({
                  name: orgName,
                  slug: retrySlug,
                  email: profile.email,
                })
                .select()
                .single();
              
              if (retryError) {
                console.error("Retry organization creation error:", retryError);
                throw new Error(`Failed to create organization: ${retryError.message || retryError.code || "Slug conflict, please try again"}`);
              }
              if (!retryOrg) {
                throw new Error("Failed to create organization: No data returned on retry");
              }
              organizationId = retryOrg.id;
            } else {
              const detailedError = errorMessage || errorCode || JSON.stringify(orgError);
              throw new Error(`Failed to create organization: ${detailedError}. Please check the browser console for more details.`);
            }
          } else if (!newOrg) {
            throw new Error("Failed to create organization: No data returned");
          } else {
            organizationId = newOrg.id;
          }

          await supabase
            .from("profiles")
            .update({ organization_id: organizationId })
            .eq("id", user.id);
        }
      }

      // Cancel old invitation
      if (currentInvitation) {
        await supabase
          .from("invitations")
          .update({ status: "cancelled" })
          .eq("id", currentInvitation.id);
      }

      // Create new invitation
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      // Try using the database function first (bypasses RLS)
      const { data: functionInvitation, error: functionError } = await supabase.rpc(
        "create_invitation",
        {
          p_organization_id: organizationId,
          p_email: "",
          p_role: "student",
          p_invited_by: user.id,
          p_expires_at: expiresAt.toISOString(),
        }
      );

      let newInvitation;

      if (!functionError && functionInvitation) {
        // Handle both array and single object returns
        newInvitation = Array.isArray(functionInvitation) 
          ? functionInvitation[0] 
          : functionInvitation;
        console.log("Invitation created via function:", newInvitation?.id);
      } else {
        // Fallback to direct insert if function doesn't exist
        console.warn("Database function not available, trying direct insert:", functionError);
        
        const token = `inv_${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
        const { data: directInvitation, error: createError } = await supabase
          .from("invitations")
          .insert({
            organization_id: organizationId,
            email: "",
            token,
            role: "student",
            invited_by: user.id,
            expires_at: expiresAt.toISOString(),
            status: "pending",
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating invitation:", createError);
          throw new Error(`Failed to create invitation: ${createError.message || createError.code || "RLS policy may be missing"}`);
        }

        if (!directInvitation) {
          throw new Error("Failed to create invitation: No data returned");
        }

        newInvitation = directInvitation;
      }

      setCurrentInvitation(newInvitation);
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      setInviteLink(`${baseUrl}/register/${newInvitation.token}`);
      setRegenerating(false);
    } catch (err) {
      console.error("Error regenerating link:", err);
      setError("Failed to regenerate link");
      setRegenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const registration = pendingRegistrations.find((r) => r.id === id);
      if (!registration) return;

      // Update invitation status to accepted
      await supabase
        .from("invitations")
        .update({ 
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", id);

      // Update the registration status in state
      setPendingRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
      );
    } catch (err) {
      console.error("Error approving registration:", err);
      setError("Failed to approve registration");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const supabase = createSupabaseBrowserClient();
      
      // Cancel the invitation
      await supabase
        .from("invitations")
        .update({ status: "cancelled" })
        .eq("id", id);

      // Remove from pending list
      setPendingRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error rejecting registration:", err);
      setError("Failed to reject registration");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
          <div className="mx-auto max-w-6xl text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-600" />
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              Loading invitation data...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !currentInvitation) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">{error}</p>
            <Link
              href="/dashboard/students"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />
      
      {/* Static Background Elements */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20" />
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 dark:opacity-10"
        aria-hidden
      />

      <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/dashboard/students"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-purple-600 dark:text-neutral-300 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Student Invitation Link 🔗
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Share your unique link with students to let them register themselves
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Invitation Link */}
            <div className="space-y-6 lg:col-span-2">
              {/* Your Unique Link */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                    <LinkIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Your Invitation Link
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This link is unique to you
                    </p>
                  </div>
                </div>

                {/* Link Display */}
                <div className="mb-4 rounded-2xl border border-white/20 bg-white/5 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Share this link with students
                  </div>
                  <div className="break-all font-mono text-sm text-neutral-900 dark:text-white">
                    {inviteLink}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={regenerateLink}
                    disabled={regenerating}
                    className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
                  >
                    {regenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Regenerate
                  </button>
                  <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                  <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>

                {/* Info */}
                <div className="mt-6 rounded-xl bg-blue-500/10 p-4 text-sm text-blue-600 dark:text-blue-400">
                  <div className="mb-1 font-semibold">How it works:</div>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• Students click your unique link</li>
                    <li>• They fill out their registration details</li>
                    <li>• You receive their submissions for approval</li>
                    <li>• Students cannot submit twice with the same email</li>
                  </ul>
                </div>
              </motion.div>

              {/* Pending Registrations */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Pending Registrations
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Review and approve student submissions
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-600 dark:text-orange-400">
                    {pendingRegistrations.filter((r) => r.status === "pending").length}
                  </span>
                </div>

                <div className="space-y-4">
                  {pendingRegistrations.length === 0 ? (
                    <div className="py-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
                      No pending registrations yet
                    </div>
                  ) : (
                    pendingRegistrations.map((student, index) => {
                      const nameParts = student.full_name.split(" ");
                      const firstName = nameParts[0] || "";
                      const lastName = nameParts.slice(1).join(" ") || "";
                      const initials = (firstName.charAt(0) + (lastName.charAt(0) || "")).toUpperCase() || "?";

                      return (
                        <motion.div
                          key={student.id}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          className={`rounded-2xl border p-4 transition ${
                            student.status === "pending"
                              ? "border-orange-500/30 bg-orange-500/10"
                              : "border-white/10 bg-white/5 opacity-50"
                          }`}
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
                                {initials}
                              </div>
                              <div>
                                <div className="font-semibold text-neutral-900 dark:text-white">
                                  {student.full_name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                            {student.status === "pending" ? (
                              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                                Pending
                              </span>
                            ) : (
                              <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                Approved
                              </span>
                            )}
                          </div>

                          <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                            {student.phone && (
                              <div>
                                <span className="text-neutral-600 dark:text-neutral-400">Phone:</span>{" "}
                                <span className="text-neutral-900 dark:text-white">{student.phone}</span>
                              </div>
                            )}
                            {student.major && (
                              <div>
                                <span className="text-neutral-600 dark:text-neutral-400">Major:</span>{" "}
                                <span className="text-neutral-900 dark:text-white">{student.major}</span>
                              </div>
                            )}
                            <div className="col-span-2">
                              <span className="text-neutral-600 dark:text-neutral-400">Submitted:</span>{" "}
                              <span className="text-neutral-900 dark:text-white">{student.submittedAt}</span>
                            </div>
                          </div>

                          {student.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(student.id)}
                                className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 text-xs font-semibold text-white transition hover:bg-green-700"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(student.id)}
                                className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-xs font-semibold text-white transition hover:bg-red-700"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Statistics */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Total Submissions
                    </h3>
                  </div>
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {pendingRegistrations.length}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Via your invitation link
                  </p>
                </div>

                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Pending Review
                    </h3>
                  </div>
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {pendingRegistrations.filter((r) => r.status === "pending").length}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Awaiting your approval
                  </p>
                </div>

                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Approved
                    </h3>
                  </div>
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {pendingRegistrations.filter((r) => r.status === "approved").length}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Students enrolled
                  </p>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">
                  💡 Pro Tips
                </h3>
                <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Share the link via email, LMS, or social media</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Students can only submit once per email address</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Regenerate link if you suspect it's compromised</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Review submissions regularly to avoid delays</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

