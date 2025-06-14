-- Add password reset fields to customers table
-- Run these SQL commands in your database:

ALTER TABLE customers ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_reset_token ON customers(reset_token);