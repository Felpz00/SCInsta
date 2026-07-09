import React, { useState } from 'react';
import { Plus, Trash2, Moon, Sun, Image as ImageIcon, Mic, PhoneMissed } from 'lucide-react';

const Editor = ({
  chatInfo,
  setChatInfo,
  messages,
  addMessage,
  updateMessage,
  deleteMessage,
  isDarkMode,
  setIsDarkMode,
  deviceSettings,
  setDeviceSettings,
  downloadScreenshot
}) => {
  const [newMessage, setNewMessage] = useState({
    text: '',
    sender: 'me',
    senderName: 'Membro',
    senderColor: '#128C7E',
    type: 'text',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'read'
  });

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (newMessage.text || newMessage.type !== 'text') {
      addMessage(newMessage);
      setNewMessage({ ...newMessage, text: '' });
    }
  };

  return (
    <div className="p-6 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">WhatsApp Fake Chat</h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Contact Settings */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Configurações do Chat</h2>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">

          <div className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-300">
            <span className="text-xs font-medium text-gray-700">Tipo de Chat</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setChatInfo({ ...chatInfo, isGroup: false })}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${!chatInfo.isGroup ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Contato
              </button>
              <button
                type="button"
                onClick={() => setChatInfo({ ...chatInfo, isGroup: true })}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${chatInfo.isGroup ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Grupo
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">{chatInfo.isGroup ? 'Nome do Grupo' : 'Nome'}</label>
              <input
                type="text"
                value={chatInfo.name}
                onChange={(e) => setChatInfo({...chatInfo, name: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">{chatInfo.isGroup ? 'Foto do Grupo (URL)' : 'Foto (URL)'}</label>
              <input
                type="text"
                value={chatInfo.photo}
                onChange={(e) => setChatInfo({...chatInfo, photo: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
              />
            </div>

            {!chatInfo.isGroup ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Status</label>
                  <select
                    value={chatInfo.status}
                    onChange={(e) => setChatInfo({...chatInfo, status: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  >
                    <option value="online">Online</option>
                    <option value="typing">Digitando...</option>
                    <option value="last-seen">Visto por último</option>
                  </select>
                </div>
                {chatInfo.status === 'last-seen' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Visto por último às</label>
                    <input
                      type="text"
                      value={chatInfo.lastSeen}
                      placeholder="hoje às 10:30"
                      onChange={(e) => setChatInfo({...chatInfo, lastSeen: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                    />
                  </div>
                )}
              </>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700">Membros do Grupo</label>
                <input
                  type="text"
                  value={chatInfo.members}
                  placeholder="Você, João, Maria..."
                  onChange={(e) => setChatInfo({...chatInfo, members: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Device & Export Settings */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Dispositivo & Exportação</h2>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Simular Dispositivo (Moldura)</label>
            <div className="flex gap-2">
              {['none', 'ios', 'android'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDeviceSettings({ ...deviceSettings, type })}
                  className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${deviceSettings.type === type ? 'bg-purple-100 text-purple-700 border-purple-200 border' : 'bg-white text-gray-600 border-gray-300 border hover:bg-gray-50'}`}
                >
                  {type === 'none' ? 'Nenhum' : type === 'ios' ? 'iOS' : 'Android'}
                </button>
              ))}
            </div>
          </div>

          {deviceSettings.type !== 'none' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">Hora</label>
                <input
                  type="text"
                  value={deviceSettings.time}
                  onChange={(e) => setDeviceSettings({...deviceSettings, time: e.target.value})}
                  className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Bateria %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={deviceSettings.battery}
                  onChange={(e) => setDeviceSettings({...deviceSettings, battery: e.target.value})}
                  className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={downloadScreenshot}
            className="w-full mt-4 bg-purple-600 text-white font-bold py-2.5 rounded-md hover:bg-purple-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Baixar Print Screen
          </button>
        </div>
      </section>

      {/* Message Adder */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Adicionar Mensagem</h2>
        <form onSubmit={handleAddMessage} className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewMessage({...newMessage, sender: 'me'})}
              className={`flex-1 py-2 text-xs font-bold rounded-md border transition-all ${newMessage.sender === 'me' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300'}`}
            >
              EU
            </button>
            <button
              type="button"
              onClick={() => setNewMessage({...newMessage, sender: 'them'})}
              className={`flex-1 py-2 text-xs font-bold rounded-md border transition-all ${newMessage.sender === 'them' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
            >
              {chatInfo.isGroup ? 'OUTRO MEMBRO' : 'CONTATO'}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'text', icon: <Plus size={14} />, label: 'Texto' },
              { id: 'image', icon: <ImageIcon size={14} />, label: 'Foto' },
              { id: 'audio', icon: <Mic size={14} />, label: 'Áudio' },
              { id: 'missed-call', icon: <PhoneMissed size={14} />, label: 'Chamada' }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setNewMessage({...newMessage, type: type.id})}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${newMessage.type === type.id ? 'bg-zinc-800 text-white border-zinc-800' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          {chatInfo.isGroup && newMessage.sender === 'them' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-md border border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700">Nome do Membro</label>
                <input
                  type="text"
                  value={newMessage.senderName}
                  onChange={(e) => setNewMessage({...newMessage, senderName: e.target.value})}
                  className="mt-1 block w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Cor do Nome</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={newMessage.senderColor}
                    onChange={(e) => setNewMessage({...newMessage, senderColor: e.target.value})}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0.5"
                  />
                  <input
                    type="text"
                    value={newMessage.senderColor}
                    onChange={(e) => setNewMessage({...newMessage, senderColor: e.target.value})}
                    className="block w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700">
              {newMessage.type === 'text' ? 'Mensagem' : newMessage.type === 'image' ? 'URL da Imagem' : newMessage.type === 'audio' ? 'Duração (ex: 0:45)' : 'Tipo de Chamada (ex: Chamada de voz)'}
            </label>
            <textarea
              value={newMessage.text}
              onChange={(e) => setNewMessage({...newMessage, text: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Horário</label>
              <input
                type="text"
                value={newMessage.time}
                onChange={(e) => setNewMessage({...newMessage, time: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            {newMessage.sender === 'me' && (
              <div>
                <label className="block text-xs font-medium text-gray-700">Verificação</label>
                <select
                  value={newMessage.status}
                  onChange={(e) => setNewMessage({...newMessage, status: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="sent">Enviado (1 check)</option>
                  <option value="delivered">Entregue (2 checks cinza)</option>
                  <option value="read">Lido (2 checks azuis)</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition-colors shadow-sm"
          >
            Adicionar à conversa
          </button>
        </form>
      </section>

      {/* Messages List */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Gerenciar Mensagens</h2>
        <div className="space-y-2">
          {messages.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 group">
              <div className="truncate flex-1 pr-4">
                <span className={`text-[10px] font-bold uppercase mr-2 ${m.sender === 'me' ? 'text-green-600' : 'text-blue-600'}`}>
                  {m.sender === 'me' ? 'Eu' : (m.senderName ? m.senderName : 'Ele(a)')}
                </span>
                <span className="text-sm text-gray-700 truncate inline-block max-w-[150px] align-bottom">
                  {m.type === 'text' ? m.text : `[${m.type}]`}
                </span>
              </div>
              <button
                onClick={() => deleteMessage(m.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Editor;
