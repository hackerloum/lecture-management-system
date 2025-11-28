-- =====================================================
-- Fix: Add RLS Policies for Organizations Table
-- =====================================================
-- This script adds Row Level Security policies to allow
-- users to create and manage their own organizations.
-- Run this in your Supabase SQL Editor.

-- First, drop any existing policies that might conflict
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Users can update their organization" ON organizations;

-- Allow any authenticated user to create organizations
-- Use auth.uid() IS NOT NULL instead of auth.role() which is more reliable
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

CREATE POLICY "Authenticated users can create organizations" ON organizations
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view organizations they belong to
CREATE POLICY "Users can view their organization" ON organizations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.organization_id = organizations.id
            AND profiles.id = auth.uid()
        )
    );

-- Allow users to update their own organization
CREATE POLICY "Users can update their organization" ON organizations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.organization_id = organizations.id
            AND profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'lecturer') -- Only admins and lecturers can update
        )
    );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'organizations';

