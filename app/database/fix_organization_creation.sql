-- =====================================================
-- Fix: Create Organization with Database Function
-- =====================================================
-- This creates a function that can create organizations
-- and link them to users, bypassing RLS issues.
-- Run this in your Supabase SQL Editor.

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_user_organization(UUID, VARCHAR, VARCHAR, VARCHAR);

-- Create function to create organization and link to user
CREATE OR REPLACE FUNCTION create_user_organization(
    p_user_id UUID,
    p_org_name VARCHAR,
    p_org_slug VARCHAR,
    p_org_email VARCHAR
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_org_id UUID;
BEGIN
    -- Create the organization
    INSERT INTO organizations (name, slug, email)
    VALUES (p_org_name, p_org_slug, p_org_email)
    RETURNING id INTO v_org_id;
    
    -- Link user to organization
    UPDATE profiles
    SET organization_id = v_org_id
    WHERE id = p_user_id;
    
    RETURN v_org_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_organization(UUID, VARCHAR, VARCHAR, VARCHAR) TO authenticated;

-- Also update the RLS policy to be more permissive
-- Drop and recreate with better check
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

CREATE POLICY "Authenticated users can create organizations" ON organizations
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

