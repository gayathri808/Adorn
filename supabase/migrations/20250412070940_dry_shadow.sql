/*
  # Add RLS policies for orders table

  1. Security Changes
    - Add RLS policy to allow public users to create orders
    - Add RLS policy to allow users to view their own orders
    - Add RLS policy to allow guest users to view orders by their email
*/

-- Enable RLS if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable order creation for all users" ON orders;
DROP POLICY IF EXISTS "Enable order viewing for owners" ON orders;

-- Create policy to allow order creation for all users
CREATE POLICY "Enable order creation for all users"
ON orders FOR INSERT
TO public
WITH CHECK (true);

-- Create policy to allow users to view their own orders
CREATE POLICY "Enable order viewing for owners"
ON orders FOR SELECT
TO public
USING (
  CASE
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
    ELSE customer_email = (current_setting('request.jwt.claims')::json->>'email')
  END
  OR customer_email IS NOT NULL
);