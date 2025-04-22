/*
  # Initial Schema for Jewelry E-commerce

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `collection_id` (uuid, foreign key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `stock` (integer)
      - `material` (text)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `total` (numeric)
      - `created_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (numeric)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create collections table
CREATE TABLE collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  stock integer DEFAULT 0,
  material text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  total numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price numeric NOT NULL
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to collections"
  ON collections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample data
INSERT INTO collections (name, slug, description, image_url) VALUES
  ('Necklaces', 'necklaces', 'Elegant necklaces for every occasion', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80'),
  ('Rings', 'rings', 'Beautiful rings to complement your style', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80'),
  ('Earrings', 'earrings', 'Stunning earrings for a perfect look', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80'),
  ('Bracelets', 'bracelets', 'Charming bracelets for any outfit', 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80');

INSERT INTO products (collection_id, name, slug, description, price, image_url, stock, material) VALUES
  ((SELECT id FROM collections WHERE slug = 'necklaces'), 'Pearl Pendant', 'pearl-pendant', 'Elegant pearl pendant necklace', 299.99, 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80', 10, 'Gold and Pearl'),
  ((SELECT id FROM collections WHERE slug = 'rings'), 'Diamond Solitaire', 'diamond-solitaire', 'Classic diamond solitaire ring', 999.99, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80', 5, 'White Gold'),
  ((SELECT id FROM collections WHERE slug = 'earrings'), 'Sapphire Studs', 'sapphire-studs', 'Beautiful sapphire stud earrings', 499.99, 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80', 8, 'White Gold and Sapphire'),
  ((SELECT id FROM collections WHERE slug = 'bracelets'), 'Tennis Bracelet', 'tennis-bracelet', 'Stunning diamond tennis bracelet', 1499.99, 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80', 3, 'White Gold and Diamond');