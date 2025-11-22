/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClientOptions } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getClientEnv, getServerEnv } from "@/lib/env";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export type SupabaseServerClient = SupabaseClient<Database>;

export type SupabaseServiceRoleClient = SupabaseClient<Database>;

export const createSupabaseServerClient = async (
  options?: SupabaseClientOptions<string>,
) => {
  const cookieStore = await cookies();

  const {
    NEXT_PUBLIC_SUPABASE_URL: url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
  } = getClientEnv();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      ...options,
    },
  ) as unknown as SupabaseServerClient;
};

export const createSupabaseServiceRoleClient = () => {
  const { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } =
    getServerEnv();

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is required to create the service role client.",
    );
  }

  return createClient(url, serviceRoleKey) as unknown as SupabaseServiceRoleClient;
};

