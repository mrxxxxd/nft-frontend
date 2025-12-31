'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';
import nftService from '@/services/nft';

export default function AdminDashboard() {
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNFTs();
    }, []);

    const loadNFTs = async () => {
        try {
            const data = await nftService.getAllNFTs();
            setNfts(data);
        } catch (error) {
            console.error('Failed to load NFTs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this NFT?')) return;

        try {
            await nftService.deleteNFT(id);
            setNfts(nfts.filter(nft => nft.id !== id));
        } catch (error) {
            console.error('Failed to delete NFT', error);
            alert('Failed to delete NFT');
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <Link
                            href="/admin/create"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
                        >
                            Create New NFT
                        </Link>
                    </div>

                    {loading ? (
                        <p>Loading NFTs...</p>
                    ) : (
                        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                            <table className="w-full text-left text-gray-300">
                                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Image</th>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Price (ETH)</th>
                                        <th scope="col" className="px-6 py-3">Creator</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nfts.map((nft) => (
                                        <tr key={nft.id} className="border-b border-gray-700 hover:bg-gray-700">
                                            <td className="px-6 py-4">
                                                <img
                                                    src={nft.image}
                                                    alt={nft.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">{nft.name}</td>
                                            <td className="px-6 py-4">{nft.price}</td>
                                            <td className="px-6 py-4">{nft.creator || 'Unknown'}</td>
                                            <td className="px-6 py-4 space-x-2">
                                                <Link
                                                    href={`/admin/edit/${nft.id}`}
                                                    className="font-medium text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(nft.id)}
                                                    className="font-medium text-red-500 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {nfts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center">No NFTs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
