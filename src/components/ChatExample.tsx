import { useCallback, useEffect, useRef, useState } from 'react';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const endpoint = import.meta.env.VITE_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_API_KEY;
const deploymentId = import.meta.env.VITE_DEPLOYMENT_ID;

const defaultMessages = [
  { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
  { role: "user", content: "Can you help me?" },
  { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
];

export const ChatExample = () => {
  const clientRef = useRef<OpenAIClient | null>(null);
  const [messages, setMessages] = useState(defaultMessages);

  const [promptMessage, setPromptMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const sendMessage = useCallback(async () => {
    setResponse('');

    if (!clientRef.current) {
      return;
    }

    const events = await clientRef.current.streamChatCompletions(deploymentId, messages, { maxTokens: 128 });

    for await (const event of events) {
      event.choices.forEach(choice => {
        const delta = choice.delta?.content;
          if (delta !== undefined) {
            setResponse((prev) => `${prev} ${delta}`)
          }
      });
    }
  }, [messages])

  useEffect(() => {
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    
    clientRef.current = client;
  }, [])

  return (
    <div style={{ display: 'flex', gap: 36 }}>
      <div>
        <h3>Chat:</h3>
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <p>{message.role}: {message.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <textarea value={promptMessage} onChange={(e) => setPromptMessage(e.target.value)} />
        <button
          disabled={promptMessage.length === 0}
          onClick={() => {
            setMessages((prevState) => [...prevState, { role: 'user', content: promptMessage }]);
            setPromptMessage('');
          }}>
          Add message
        </button>
        <button onClick={sendMessage}>
          Submit chat
        </button>
      </div>
      <div style={{ maxWidth: '800px' }}>
        <h3>Response:</h3>
        <div>
          <p>{response}</p>
        </div>
      </div>
    </div>
  )
}
