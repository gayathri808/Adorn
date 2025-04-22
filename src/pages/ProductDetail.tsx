import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];
type ProductImage = Database['public']['Tables']['product_images']['Row'];

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (productError) throw productError;

        setProduct(productData);

        // Fetch product images
        const { data: imageData, error: imageError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', productData.id)
          .order('is_primary', { ascending: false });

        if (imageError) throw imageError;

        setProductImages(imageData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success('Added to cart');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative">
            <img
              src={productImages[currentImageIndex]?.image_url || product.image_url}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-lg"
            />
            {productImages.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 ${
                    currentImageIndex === index
                      ? 'ring-2 ring-gray-900'
                      : 'hover:opacity-75'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`${product.name} view ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-900 mb-6">${product.price.toFixed(2)}</p>
          <div className="prose prose-sm mb-6">
            <p>{product.description}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">Material</h2>
            <p className="text-gray-600">{product.material}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">Availability</h2>
            <p className="text-gray-600">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          </div>
          {product.stock > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium mb-2">Quantity</h2>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            className="w-full bg-gray-900 text-white py-3 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;