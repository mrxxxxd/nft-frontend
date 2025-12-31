'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import nftService from '@/services/nft';

export default function EditNFTPage() {
    const router = useRouter();
    const params = useParams(); // { id: string }

    // params can be string or string[] or undefined depending on route type, but here [id] is singular
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        is_listed: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            loadNFT(id);
        }
    }, [id]);

    const loadNFT = async (nftId: string) => {
        try {
            const data = await nftService.getNFTById(nftId);
            setFormData({
                name: data.name,
                price: data.price.toString(),
                description: data.description || '',
                is_listed: data.is_listed
            });
        } catch (err: any) {
            console.error(err);
            setError('Failed to load NFT details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (!id) throw new Error("No ID provided");

            await nftService.updateNFT(id, {
                ...formData,
                price: parseFloat(formData.price)
            });
            router.push('/admin');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update NFT');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center">
                <div className="w-full max-w-2xl">
                    <h1 className="text-3xl font-bold mb-8">Edit NFT</h1>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
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
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Price (ETH)</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="is_listed"
                                    value={formData.is_listed ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, is_listed: e.target.value === 'true' })}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="true">Listed</option>
                                    <option value="false">Unlisted</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
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
                                    disabled={saving}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
