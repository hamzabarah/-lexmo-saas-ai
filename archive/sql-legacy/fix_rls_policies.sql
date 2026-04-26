-- Fix RLS Policies for user_subscriptions
-- This allows admin to insert subscriptions even when user_id is NULL

-- Step 1: Drop existing admin insert policy
DROP POLICY IF EXISTS "Admin can insert subscriptions" ON user_subscriptions;

-- Step 2: Recreate with better logic that handles NULL user_id
CREATE POLICY "Admin can insert subscriptions"
    ON user_subscriptions
    FOR INSERT
    WITH CHECK (
        -- Check if current user is admin
        (
            SELECT email FROM auth.users 
            WHERE id = auth.uid()
        ) = 'academyfrance75@gmail.com'
    );

-- Step 3: Also update the SELECT policy to allow admin to see all
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;

CREATE POLICY "Users can view own subscription"
    ON user_subscriptions
    FOR SELECT
    USING (
        -- User can see their own subscription
        auth.uid() = user_id
        OR
        -- OR if they are admin
        (
            SELECT email FROM auth.users 
            WHERE id = auth.uid()
        ) = 'academyfrance75@gmail.com'
    );

-- Step 4: Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_subscriptions';
