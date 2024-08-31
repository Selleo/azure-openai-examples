import { ChangeEvent, FC, useState } from 'react';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const endpoint = import.meta.env.VITE_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_API_KEY;
const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID;

export const AudioTranscriptionExample: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const fetchTranscription = async () => {
    if (!selectedFile) {
      setError('Please select an audio file.');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
      const response = await client.getAudioTranscription(deploymentId, uint8Array);
      setTranscription(response.text);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transcription');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Audio Transcription</h1>
      <div>
        <label htmlFor="audio-file" >Upload an audio file:</label>
        <div>
          <input id="audio-file" type="file" accept="audio/*" onChange={handleFileChange} />
          {selectedFile && <p>Selected file: {selectedFile.name}</p>}
        </div>
      </div>
      <button disabled={!selectedFile} onClick={fetchTranscription}>Get Transcription</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {transcription && (
        <div>
          <h2>Transcription:</h2>
          <pre>{transcription}</pre>
        </div>
      )}
    </div>
  );
};