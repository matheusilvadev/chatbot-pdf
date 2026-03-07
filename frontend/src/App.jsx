import { useState } from 'react';
import './App.css';
import UploadPDF from './components/UploadPDF';
import ChatBox from './components/ChatBox';
import StatusBar from './components/StatusBar';

function App() {
  const [pdfLoaded, setPdfLoaded] = useState(false);
  function handleUploadSuccess() {
    setPdfLoaded(true);
  }

  return (
    <div className="app">
      <h1 className="app-title">Chatbot PDF</h1>
      <StatusBar pdfLoaded={pdfLoaded} />
      {!pdfLoaded && <UploadPDF onUploadSuccess={handleUploadSuccess} />}
      {pdfLoaded && <ChatBox />}
    </div>
  );
}

export default App;
