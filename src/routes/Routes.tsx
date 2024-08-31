import {
    createBrowserRouter,
    RouteObject,
    RouterProvider,
} from "react-router-dom";

import { Layout } from "./Layout";
import {
  AudioTranscriptionExample,
  ChatExample,
  EmbeddingExample,
  ImageExample
} from "../components";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <ChatExample /> },
      { path: '/image', element: <ImageExample /> },
      { path: '/text-embedding', element: <EmbeddingExample /> },
      { path: '/audio-transcription', element: <AudioTranscriptionExample /> },
    ]
  },
];

const browserRouter = createBrowserRouter(routes);

export const Routes = () => <RouterProvider router={browserRouter} />;
