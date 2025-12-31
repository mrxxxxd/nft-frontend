'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import nftService from '@/services/nft';

export default function CreateNFTPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!image) {
            setError('Please select an image');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('image', image); // Append file

            await nftService.createNFT(formData);
            router.push('/admin');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create NFT');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center">
                <div className="w-full max-w-2xl">
                    <h1 className="text-3xl font-bold mb-8">Create New NFT</h1>

                    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Price (ETH)</label>
                            <input
                                type="number"
                                step="0.0001"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Image File</label>
                            <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                            >
                                {loading ? 'Uploading...' : 'Create NFT'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminGuard>
    );
}
