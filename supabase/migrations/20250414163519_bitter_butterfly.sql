/*
  # Add product images table and sample data

  1. New Tables
    - `product_images`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `image_url` (text)
      - `is_primary` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on product_images table
    - Add policy for public read access
*/

-- Create product_images table
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access
CREATE POLICY "Allow public read access to product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
  -- Pearl Pendant images
  ((SELECT id FROM products WHERE slug = 'pearl-pendant'), 'https://images.unsplash.com/photo-1598560917505-59a3ad559071', true),
  ((SELECT id FROM products WHERE slug = 'pearl-pendant'), 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', false),
  ((SELECT id FROM products WHERE slug = 'pearl-pendant'), 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a', false),
  
  -- Diamond Solitaire images
  ((SELECT id FROM products WHERE slug = 'diamond-solitaire'), 'https://images.unsplash.com/photo-1605100804763-247f67b3557e', true),
  ((SELECT id FROM products WHERE slug = 'diamond-solitaire'), 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9', false),
  ((SELECT id FROM products WHERE slug = 'diamond-solitaire'), 'https://images.unsplash.com/photo-1605100804737-e35526bc8a55', false),
  
  -- Sapphire Studs images
  ((SELECT id FROM products WHERE slug = 'sapphire-studs'), 'https://images.unsplash.com/photo-1635767798638-3e25273a8236', true),
  ((SELECT id FROM products WHERE slug = 'sapphire-studs'), 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36', false),
  ((SELECT id FROM products WHERE slug = 'sapphire-studs'), 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0', false),
  
  -- Tennis Bracelet images
  ((SELECT id FROM products WHERE slug = 'tennis-bracelet'), 'https://images.unsplash.com/photo-1611085583191-a3b181a88401', true),
  ((SELECT id FROM products WHERE slug = 'tennis-bracelet'), 'https://images.unsplash.com/photo-1599643477877-530eb83abc2e', false),
  ((SELECT id FROM products WHERE slug = 'tennis-bracelet'), 'https://images.unsplash.com/photo-1599643477716-c52be79d8bd3', false);