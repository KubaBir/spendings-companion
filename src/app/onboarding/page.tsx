import { fetchBankingProviders } from './_actions';
import ProvidersBox from './components/ProvidersBox';

export default async function Home() {
    const providers = await fetchBankingProviders();

    return (
        <div className="flex items-center justify-center h-[calc(100dvh-64px)]">
            <ProvidersBox providers={providers} />
        </div>
    );
}
