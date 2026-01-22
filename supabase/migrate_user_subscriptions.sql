-- Migration Script: Update user_subscriptions table
-- This script updates the existing table instead of recreating it

-- Step 1: Drop the UNIQUE constraint on user_id if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_subscriptions_user_id_key'
    ) THEN
        ALTER TABLE user_subscriptions DROP CONSTRAINT user_subscriptions_user_id_key;
        RAISE NOTICE 'Dropped UNIQUE constraint on user_id';
    ELSE
        RAISE NOTICE 'UNIQUE constraint on user_id does not exist';
    END IF;
END $$;

-- Step 2: Make user_id nullable (if not already)
ALTER TABLE user_subscriptions 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Add UNIQUE constraint on email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_subscriptions_email_key'
    ) THEN
        ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_email_key UNIQUE (email);
        RAISE NOTICE 'Added UNIQUE constraint on email';
    ELSE
        RAISE NOTICE 'UNIQUE constraint on email already exists';
    END IF;
END $$;

-- Verification: Show current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'user_subscriptions'
ORDER BY ordinal_position;

-- Show constraints
SELECT
    conname as constraint_name,
    contype as constraint_type,
    a.attname as column_name
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
WHERE c.conrelid = 'user_subscriptions'::regclass
ORDER BY c.conname;
