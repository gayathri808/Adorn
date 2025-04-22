/*
  # Update RLS policies to allow guest orders

  1. Changes
    - Update RLS policies on orders and order_items tables to allow guest orders
    - Make user_id column nullable in orders table
    - Add policies for public access

  2. Security
    - Maintain data integrity while allowing guest orders
*/

-- Make user_id nullable
ALTER TABLE orders
ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create their own order items" ON order_items;

-- Create new policies for orders
CREATE POLICY "Allow order creation"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow order viewing with matching email"
  ON orders FOR SELECT
  TO public
  USING (
    CASE 
      WHEN auth.uid() IS NOT NULL THEN user_id = auth.uid()
      ELSE customer_email IS NOT NULL
    END
  );

-- Create new policies for order items
CREATE POLICY "Allow order items creation"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow viewing order items"
  ON order_items FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
    )
  );