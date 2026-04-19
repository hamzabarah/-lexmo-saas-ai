-- Allow 'ecommerce' (formation complète 497€) and 'ecommerce_basic' (formation sans
-- accompagnement 197€) as valid plan values in user_subscriptions.
ALTER TABLE user_subscriptions
  DROP CONSTRAINT IF EXISTS user_subscriptions_plan_check;
ALTER TABLE user_subscriptions
  ADD CONSTRAINT user_subscriptions_plan_check
  CHECK (plan IN ('spark', 'emperor', 'legend', 'diagnostic', 'ecommerce', 'ecommerce_basic'));
