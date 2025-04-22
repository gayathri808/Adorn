import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];

const Products = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    material: 'all',
    inStock: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('collection_id', (
          await supabase
            .from('collections')
            .select('id')
            .eq('slug', slug)
            .single()
        ).data?.id);

      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        query = query.gte('price', min).lte('price', max);
      }

      if (filters.material !== 'all') {
        query = query.eq('material', filters.material);
      }

      if (filters.inStock) {
        query = query.gt('stock', 0);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [slug, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Price Range</h3>
              <select
                className="w-full border rounded-md p-2"
                value={filters.priceRange}
                onChange={(e) =>
                  setFilters({ ...filters, priceRange: e.target.value })
                }
              >
                <option value="all">All Prices</option>
                <option value="0-100">Under $100</option>
                <option value="100-500">$100 - $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-5000">Over $1,000</option>
              </select>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Material</h3>
              <select
                className="w-full border rounded-md p-2"
                value={filters.material}
                onChange={(e) =>
                  setFilters({ ...filters, material: e.target.value })
                }
              >
                <option value="all">All Materials</option>
                <option value="Gold">Gold</option>
                <option value="White Gold">White Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) =>
                    setFilters({ ...filters, inStock: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm font-medium">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.image_url || ''}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                    <Link
                      to={`/products/${product.slug}`}
                      className="bg-white text-gray-900 px-6 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;