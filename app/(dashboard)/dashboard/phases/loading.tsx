export default function Loading() {
    return (
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">جاري تحميل الدروس...</p>
            </div>
        </div>
    );
}
