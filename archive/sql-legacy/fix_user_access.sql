-- Ensure users can read their own subscription data
-- This is critical for the 'Restricted Access' check to pass
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;

CREATE POLICY "Users can view own subscription"
ON user_subscriptions FOR SELECT
USING (
  auth.uid() = user_id
);
