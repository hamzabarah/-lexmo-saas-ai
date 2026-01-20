'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Card from "@/app/components/dashboard/Card";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
            <Card className="text-center p-8 border-red-500/30 bg-red-500/10">
                <h2 className="text-xl font-bold text-red-400 mb-2">عذراً، حدث خطأ ما!</h2>
                <p className="text-gray-400 mb-6">{error.message || "لم نتمكن من تحميل المراحل."}</p>
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                    محاولة مرة أخرى
                </button>
            </Card>
        </div>
    );
}
