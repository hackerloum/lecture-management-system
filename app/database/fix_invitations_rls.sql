-- =====================================================
-- Fix: Add RLS Policies for Invitations Table
-- =====================================================
-- This script adds Row Level Security policies to allow
-- users to create and manage invitations for their organization.
-- Run this in your Supabase SQL Editor.

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create invitations" ON invitations;
DROP POLICY IF EXISTS "Users can view their organization invitations" ON invitations;
DROP POLICY IF EXISTS "Users can update their organization invitations" ON invitations;

-- Allow users to create invitations for their organization
CREATE POLICY "Users can create invitations" ON invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.organization_id = invitations.organization_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'lecturer')
        )
    );

-- Allow users to view invitations for their organization
CREATE POLICY "Users can view their organization invitations" ON invitations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.organization_id = invitations.organization_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'lecturer')
        )
    );

-- Allow users to update invitations for their organization
CREATE POLICY "Users can update their organization invitations" ON invitations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.organization_id = invitations.organization_id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'lecturer')
        )
    );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'invitations';

