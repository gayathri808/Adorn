import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80"
          alt="Hero"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Elegant Jewelry Collection</h1>
            <p className="text-xl mb-8">Discover our exclusive pieces</p>
            <Link
              to="/collections/necklaces"
              className="bg-white text-gray-900 px-8 py-3 rounded-md hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">Featured Products</h2>
        <div className='flex items-center justify-center mb-12'>
            <div className='h-1 w-10 bg-black rounded-md'></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link to="/collections/necklaces" className="group">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80"
                alt="Necklaces"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">Necklaces</h3>
              </div>
            </div>
          </Link>
          <Link to="/collections/rings" className="group">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80"
                alt="Rings"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">Rings</h3>
              </div>
            </div>
          </Link>
          <Link to="/collections/earrings" className="group">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80"
                alt="Earrings"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">Earrings</h3>
              </div>
            </div>
          </Link>
          <Link to="/collections/bracelets" className="group">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80"
                alt="Bracelets"
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">Bracelets</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;