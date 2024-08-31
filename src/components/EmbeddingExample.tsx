import { FC, useEffect, useRef, useState } from 'react';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const endpoint = import.meta.env.VITE_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_API_KEY;
const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID;

export const EmbeddingExample: FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [embeddings, setEmbeddings] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<OpenAIClient | null>(null);

  const fetchEmbeddings = async () => {
    if (!clientRef.current) {
      return;
    }

    try {
      const response = await clientRef.current.getEmbeddings(deploymentId, [inputText]);

      if (response.data.length > 0) {
        setEmbeddings(response.data[0].embedding);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch embeddings');
      console.error(err);
    }
  };

  useEffect(() => {
    clientRef.current = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
  }, []);

  return (
    <div>
      <h1>Text Embeddings</h1>
      <input
        type="text"
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        placeholder="Enter text"
      />
      <button onClick={fetchEmbeddings}>Get Embeddings</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {embeddings && (
        <div>
          <h2>Embeddings:</h2>
          <pre>{JSON.stringify(embeddings, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};