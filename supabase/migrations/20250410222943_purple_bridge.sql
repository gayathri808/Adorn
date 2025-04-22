/*
  # Add payment fields to orders table

  1. Changes
    - Add payment_id column to orders table
    - Add order_id column to orders table (for Razorpay order ID)

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE orders
ADD COLUMN payment_id text,
ADD COLUMN order_id text;