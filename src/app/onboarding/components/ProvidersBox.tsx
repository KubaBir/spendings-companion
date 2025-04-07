import ProviderCard from './ProviderCard';

export default function ProvidersBox({ providers }) {
    return (
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Banking Providers</h2>

            {providers.length === 0 ? (
                <p className="text-gray-400 text-center">No banking providers found.</p>
            ) : (
                <div className="space-y-3 h-144 overflow-y-auto pr-2">
                    {providers.map((provider) => (
                        <ProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>
            )}
        </div>
    );
}
