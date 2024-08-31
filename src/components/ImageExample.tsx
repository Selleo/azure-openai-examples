import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { useCallback, useEffect, useRef, useState } from "react";

const endpoint = import.meta.env.VITE_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_API_KEY;
const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID;

// Number of images to create
const n = 1;
const size = "1024x1024";

export const ImageExample = () => {
  const clientRef = useRef<OpenAIClient | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');

  const handleCreateImage = useCallback(async () => {
    if (!clientRef.current) {
      return;
    }

    const results = await clientRef.current.getImages(deploymentId, prompt, { n, size });

    for (const image of results.data) {
        const url = image.url || '';

        if (url.length > 0) {
            setImageUrls((prev) => [...prev, url]);
        }
    }
  }, []);

  useEffect(() => {
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

    clientRef.current = client;
  }, []);

  return (
    <div>
        <div>
          <textarea
            placeholder="a monkey eating a banana"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          /> 
        </div>
        <button
          onClick={handleCreateImage}
          disabled={prompt.length === 0}
        >
          Create image
        </button>
        <div>
            {imageUrls.map((url) => (
                <img key={url} src={url} alt="Generated image" />
            ))}
        </div>
    </div>
  )
}
