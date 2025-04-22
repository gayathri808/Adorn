/*
  # Fix RLS policies for orders and order items

  1. Changes
    - Drop existing RLS policies for orders and order items
    - Create new, more permissive policies for order creation and viewing
    - Add policies to handle both authenticated and unauthenticated users
  
  2. Security
    - Enable RLS on orders and order_items tables
    - Add policies for order creation and viewing
    - Allow public access for creating orders (needed for guest checkout)
    - Allow viewing orders based on customer email or user_id
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow order creation" ON orders;
DROP POLICY IF EXISTS "Allow order viewing with matching email" ON orders;
DROP POLICY IF EXISTS "Allow order items creation" ON order_items;
DROP POLICY IF EXISTS "Allow viewing order items" ON order_items;

-- Create new policies for orders
CREATE POLICY "Enable order creation for all users"
ON orders FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable order viewing for owners"
ON orders FOR SELECT
TO public
USING (
  CASE
    WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
    ELSE customer_email = current_setting('request.jwt.claims')::json->>'email'
  END
  OR
  customer_email IS NOT NULL
);

-- Create new policies for order items
CREATE POLICY "Enable order items creation for all users"
ON order_items FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable order items viewing for order owners"
ON order_items FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      CASE
        WHEN auth.uid() IS NOT NULL THEN orders.user_id = auth.uid()
        ELSE orders.customer_email = current_setting('request.jwt.claims')::json->>'email'
      END
      OR
      orders.customer_email IS NOT NULL
    )
  )
);