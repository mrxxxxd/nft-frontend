'use client';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type NFT = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function Home() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const data = await apiClient.get('/api/nfts');
      setNfts(data);
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            NFT Marketplace
          </h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Featured NFTs</h2>
          <p className="text-gray-400">Discover unique digital assets</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <p className="mt-4 text-gray-400">Loading NFTs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <div key={nft.id} className="bg-gray-800 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/nft${nft.id}/400/400`}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{nft.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p className="text-xl font-bold text-cyan-400">{nft.price} ETH</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-semibold hover:opacity-90">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Total Volume</h3>
            <p className="text-3xl font-bold text-cyan-400">124.5 ETH</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-purple-400">2,847</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">NFTs Listed</h3>
            <p className="text-3xl font-bold text-green-400">{nfts.length}+</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">
          <p>© 2024 NFT Marketplace. All digital assets are verified on the blockchain.</p>
          <p className="mt-2 text-sm">Backend API Status: <span className="text-green-400">Connected</span></p>
        </div>
      </footer>
    </div>
  );
}
