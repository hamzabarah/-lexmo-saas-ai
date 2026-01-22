-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NULL,  -- Nullable for invitations
    email TEXT NOT NULL UNIQUE,  -- Email must be unique
    plan TEXT NOT NULL CHECK (plan IN ('spark', 'emperor', 'legend')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    activated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription
CREATE POLICY "Users can view own subscription"
    ON user_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Only admin can insert subscriptions
CREATE POLICY "Admin can insert subscriptions"
    ON user_subscriptions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'academyfrance75@gmail.com'
        )
    );

-- Policy: Only admin can update subscriptions
CREATE POLICY "Admin can update subscriptions"
    ON user_subscriptions
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'academyfrance75@gmail.com'
        )
    );

-- Policy: Only admin can delete subscriptions
CREATE POLICY "Admin can delete subscriptions"
    ON user_subscriptions
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND email = 'academyfrance75@gmail.com'
        )
    );

-- Create index for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_email ON user_subscriptions(email);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- Grant permissions
GRANT SELECT ON user_subscriptions TO authenticated;
GRANT ALL ON user_subscriptions TO service_role;
