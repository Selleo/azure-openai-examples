import { Outlet, useNavigate } from "react-router-dom"

export const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <nav>
        <button onClick={() => navigate('/')}>Chat</button>
        <button onClick={() => navigate('/image')}>Image</button>
        <button onClick={() => navigate('/text-embedding')}>Text embedding</button>
        <button onClick={() => navigate('/audio-transcription')}>Audio transcription</button>
      </nav>
      <div className="example">
        <Outlet />
      </div>
    </div>
  )
}
