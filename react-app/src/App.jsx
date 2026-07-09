import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import Editor from './components/Editor';
import Preview from './components/Preview';

function App() {
  const previewRef = useRef(null);
  const [chatInfo, setChatInfo] = useState({
    isGroup: false,
    name: 'Jules',
    photo: 'https://i.pravatar.cc/150?u=jules',
    status: 'online',
    lastSeen: '',
    members: 'Você, João, Maria'
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Como posso ajudar você hoje?',
      time: '10:00',
      sender: 'them',
      senderName: 'João',
      senderColor: '#128C7E',
      type: 'text',
      status: 'read'
    },
    {
      id: 2,
      text: 'Estou criando um gerador de conversas fakes!',
      time: '10:01',
      sender: 'me',
      type: 'text',
      status: 'read'
    }
  ]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deviceSettings, setDeviceSettings] = useState({
    type: 'none', // 'ios', 'android', 'none'
    time: '09:41',
    battery: 100
  });

  const downloadScreenshot = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDarkMode ? '#0b141a' : '#e5ddd5',
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `fake-chat-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Failed to generate screenshot:', error);
      alert('Erro ao gerar print screen. Tente novamente.');
    }
  };

  const addMessage = (newMessage) => {
    setMessages([...messages, { ...newMessage, id: Date.now() }]);
  };

  const updateMessage = (id, updatedFields) => {
    setMessages(messages.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-gray-100 ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 overflow-y-auto h-screen">
        <Editor
          chatInfo={chatInfo}
          setChatInfo={setChatInfo}
          messages={messages}
          addMessage={addMessage}
          updateMessage={updateMessage}
          deleteMessage={deleteMessage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          deviceSettings={deviceSettings}
          setDeviceSettings={setDeviceSettings}
          downloadScreenshot={downloadScreenshot}
        />
      </div>
      <div className="flex-1 flex justify-center items-center p-4 bg-gray-200 dark:bg-zinc-900 overflow-hidden h-screen">
        <div className="w-full max-w-[450px] h-full max-h-[850px] shadow-2xl rounded-2xl overflow-hidden">
          <Preview
            previewRef={previewRef}
            chatInfo={chatInfo}
            messages={messages}
            isDarkMode={isDarkMode}
            deviceSettings={deviceSettings}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
