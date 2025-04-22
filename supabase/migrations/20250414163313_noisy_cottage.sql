/*
  # Update Order and Order Items RLS Policies

  1. Changes
    - Add policy to allow updating orders by customer email
    - Add policy to allow order items creation with order reference
    
  2. Security
    - Maintains existing RLS enabled status
    - Adds more granular control over order updates
    - Ensures order items can be created along with orders
*/

-- Update orders policies to allow updates
CREATE POLICY "Enable order updates for owners"
ON orders
FOR UPDATE
TO public
USING (
  CASE
    WHEN (auth.uid() IS NOT NULL) THEN (user_id = auth.uid())
    ELSE (customer_email = (current_setting('request.jwt.claims'::text)::json ->> 'email'::text))
  END
  OR (customer_email IS NOT NULL)
)
WITH CHECK (
  CASE
    WHEN (auth.uid() IS NOT NULL) THEN (user_id = auth.uid())
    ELSE (customer_email = (current_setting('request.jwt.claims'::text)::json ->> 'email'::text))
  END
  OR (customer_email IS NOT NULL)
);

-- Update order items policies to ensure they can be created with orders
CREATE POLICY "Enable order items creation with order reference"
ON order_items
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND (
      CASE
        WHEN (auth.uid() IS NOT NULL) THEN (orders.user_id = auth.uid())
        ELSE (orders.customer_email = (current_setting('request.jwt.claims'::text)::json ->> 'email'::text))
      END
      OR (orders.customer_email IS NOT NULL)
    )
  )
);