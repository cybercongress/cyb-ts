import { useEffect, useState } from 'react';
import * as Comlink from 'comlink';
import { useBackend } from 'src/contexts/backend/backend';
import { EmbeddingApi } from 'src/services/backend/workers/background/api/mlApi';

// Create the worker

// Custom hook to use the Embedding API
const useEmbeddingApi = () => {
  const [api, setApi] = useState<EmbeddingApi | null>(null);
  const { embeddingApi$ } = useBackend();
  useEffect(() => {
    // Get the observable from the worker

    // Subscribe to the observable
    const subscription = embeddingApi$.subscribe((api) => {
      console.log('-----useEmbeddingApi setApi', api);

      setApi(api);
    });

    // Return the cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return api;
};

export default useEmbeddingApi;
