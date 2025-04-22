/*
  # Add customer details to orders table

  1. Changes
    - Add customer_name column to orders table
    - Add customer_email column to orders table

  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE orders
ADD COLUMN customer_name text,
ADD COLUMN customer_email text;