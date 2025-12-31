'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/auth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();

        if (!user || user.role !== 'admin') {
            // Redirect to home if not admin (or login if you prefer)
            // Using home as safer default vs infinite redirects loop if redirected to protected login mistakenly
            router.push('/');
        } else {
            setAuthorized(true);
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
                <p>Loading...</p>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}
