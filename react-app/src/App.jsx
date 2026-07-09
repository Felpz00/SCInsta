import React, { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';

function App() {
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
        />
      </div>
      <div className="flex-1 flex justify-center items-center p-4 bg-gray-200 dark:bg-zinc-900 overflow-hidden h-screen">
        <div className="w-full max-w-[450px] h-full max-h-[850px] shadow-2xl rounded-2xl overflow-hidden">
          <Preview
            chatInfo={chatInfo}
            messages={messages}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
