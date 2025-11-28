-- =====================================================
-- Fix: Create Database Function for Invitation Creation
-- =====================================================
-- This script creates a database function that bypasses RLS
-- to create invitations, ensuring they're created correctly
-- even if there are timing issues with profile updates.
-- Run this in your Supabase SQL Editor.

-- Drop the function if it exists
DROP FUNCTION IF EXISTS create_invitation(
    p_organization_id UUID,
    p_email TEXT,
    p_role TEXT,
    p_invited_by UUID,
    p_expires_at TIMESTAMPTZ
);

-- Create the function
CREATE OR REPLACE FUNCTION create_invitation(
    p_organization_id UUID,
    p_email TEXT,
    p_role TEXT,
    p_invited_by UUID,
    p_expires_at TIMESTAMPTZ
)
RETURNS TABLE (
    id UUID,
    organization_id UUID,
    email TEXT,
    token TEXT,
    role TEXT,
    invited_by UUID,
    expires_at TIMESTAMPTZ,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass RLS
AS $$
DECLARE
    v_token TEXT;
    v_invitation_id UUID;
BEGIN
    -- Generate a unique token
    v_token := 'inv_' || substr(md5(random()::text || clock_timestamp()::text), 1, 32) || '_' || extract(epoch from now())::text;
    
    -- Insert the invitation
    INSERT INTO invitations (
        organization_id,
        email,
        token,
        role,
        invited_by,
        expires_at,
        status
    )
    VALUES (
        p_organization_id,
        COALESCE(p_email, ''),
        v_token,
        p_role,
        p_invited_by,
        p_expires_at,
        'pending'
    )
    RETURNING invitations.id INTO v_invitation_id;
    
    -- Return the created invitation
    RETURN QUERY
    SELECT 
        i.id,
        i.organization_id,
        i.email,
        i.token,
        i.role,
        i.invited_by,
        i.expires_at,
        i.status,
        i.created_at,
        i.updated_at
    FROM invitations i
    WHERE i.id = v_invitation_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_invitation TO authenticated;

-- Verify the function was created
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'create_invitation';

