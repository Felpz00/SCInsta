import React from 'react';
import { ChevronLeft, Video, Phone, MoreVertical, Check, CheckCheck, Play, Mic, Paperclip, Camera, Smile, Wifi, Signal, Battery, BatteryFull } from 'lucide-react';

const Preview = ({ previewRef, chatInfo, messages, isDarkMode, deviceSettings }) => {
  return (
    <div
      ref={previewRef}
      className={`flex flex-col h-full w-full font-sans select-none overflow-hidden relative ${isDarkMode ? 'dark bg-[#0b141a]' : 'bg-[#e5ddd5]'} ${deviceSettings.type !== 'none' ? 'pt-7 pb-8 rounded-[2rem] border-8 border-gray-800' : ''}`}
    >

      {/* iOS/Android Status Bar Simulation */}
      {deviceSettings.type === 'ios' && (
        <div className="absolute top-0 left-0 right-0 h-7 px-6 flex justify-between items-center text-[11px] font-semibold text-black dark:text-white z-10 bg-[#f0f2f5] dark:bg-[#202c33]">
          <span>{deviceSettings.time}</span>
          <div className="flex items-center gap-1.5">
            <Signal size={14} />
            <Wifi size={14} />
            <div className="flex items-center">
              <span className="mr-1">{deviceSettings.battery}%</span>
              <BatteryFull size={16} />
            </div>
          </div>
        </div>
      )}

      {deviceSettings.type === 'android' && (
        <div className="absolute top-0 left-0 right-0 h-7 px-4 flex justify-between items-center text-[10px] font-medium text-black dark:text-white z-10 bg-[#f0f2f5] dark:bg-[#202c33]">
          <span>{deviceSettings.time}</span>
          <div className="flex items-center gap-1.5">
            <Wifi size={12} />
            <Signal size={12} />
            <div className="flex items-center">
              <span className="mr-1">{deviceSettings.battery}%</span>
              <BatteryFull size={14} className="rotate-90" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#f0f2f5] dark:bg-[#202c33] border-b dark:border-white/5 shrink-0">
        <div className="flex items-center gap-2 max-w-[70%]">
          <ChevronLeft className="text-[#00a884] shrink-0" size={24} />
          <div className="relative shrink-0">
            <img
              src={chatInfo.photo}
              alt={chatInfo.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-gray-800 dark:text-[#e9edef] text-[15px] leading-tight truncate">
              {chatInfo.name}
            </span>
            <span className="text-[12px] text-gray-500 dark:text-[#8696a0] truncate">
              {chatInfo.isGroup ?
                chatInfo.members :
                (chatInfo.status === 'typing' ? 'digitando...' :
                 chatInfo.status === 'online' ? 'online' :
                 chatInfo.lastSeen ? `visto por último ${chatInfo.lastSeen}` : '')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[#54656f] dark:text-[#aebac1]">
          <Video size={20} />
          <Phone size={18} />
          <MoreVertical size={20} />
        </div>
      </div>

      {/* Chat Background/Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin"
        style={{
          backgroundImage: isDarkMode
            ? 'url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)'
            : 'url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)',
          backgroundBlendMode: isDarkMode ? 'overlay' : 'soft-light',
          backgroundColor: isDarkMode ? '#0b141a' : '#e5ddd5'
        }}
      >
        <div className="flex justify-center mb-4">
          <span className="bg-[#d1f4ff] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[11px] px-3 py-1 rounded-lg shadow-sm uppercase font-medium">
            Hoje
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-2 py-1.5 shadow-sm relative group ${
                msg.sender === 'me'
                  ? 'bg-[#d9fdd3] dark:bg-[#005c4b] rounded-tr-none'
                  : 'bg-white dark:bg-[#202c33] rounded-tl-none'
              }`}
            >
              {/* Member Name (Group Only) */}
              {chatInfo.isGroup && msg.sender === 'them' && msg.senderName && (
                <div
                  className="text-[12.5px] font-medium leading-[1.2] mb-0.5"
                  style={{ color: msg.senderColor || '#128C7E' }}
                >
                  {msg.senderName}
                </div>
              )}

              {/* Message Content */}
              {msg.type === 'text' && (
                <div className="text-[14.2px] text-gray-900 dark:text-[#e9edef] whitespace-pre-wrap pr-12">
                  {msg.text}
                </div>
              )}

              {msg.type === 'image' && (
                <div className="space-y-1">
                  <img src={msg.text} alt="Shared" className="rounded-md max-w-full max-h-[300px] object-cover" />
                </div>
              )}

              {msg.type === 'audio' && (
                <div className="flex items-center gap-3 py-1 min-w-[200px]">
                  <div className="relative">
                     <img
                       src={msg.sender === 'them' && chatInfo.isGroup ? `https://i.pravatar.cc/150?u=${msg.senderName}` : chatInfo.photo}
                       className="w-10 h-10 rounded-full"
                       alt=""
                     />
                     <Mic size={14} className="absolute -bottom-1 -right-1 text-blue-500 bg-white dark:bg-[#202c33] rounded-full p-0.5" />
                  </div>
                  <Play size={20} className="text-gray-500 fill-current" />
                  <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-blue-500"></div>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-[#8696a0]">{msg.text || '0:00'}</span>
                </div>
              )}

              {msg.type === 'missed-call' && (
                <div className="flex items-center gap-3 py-1">
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                    <Phone size={18} className="text-red-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium dark:text-[#e9edef]">Chamada de voz perdida</span>
                    <span className="text-[11px] text-gray-500 dark:text-[#8696a0]">{msg.time}</span>
                  </div>
                </div>
              )}

              {/* Message Footer (Time & Checks) */}
              <div className={`flex items-center gap-1 absolute bottom-1 right-1.5 ${msg.type === 'audio' || msg.type === 'missed-call' ? 'relative mt-1 justify-end' : ''}`}>
                <span className="text-[10px] text-gray-500 dark:text-white/60">
                  {msg.time}
                </span>
                {msg.sender === 'me' && (
                  <div className="flex">
                    {msg.status === 'sent' && <Check size={14} className="text-gray-400" />}
                    {msg.status === 'delivered' && <CheckCheck size={14} className="text-gray-400" />}
                    {msg.status === 'read' && <CheckCheck size={14} className="text-[#53bdeb]" />}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Input Bar */}
      <div className="px-3 py-2 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center gap-3 shrink-0 relative z-10">
        <Smile className="text-[#54656f] dark:text-[#aebac1]" size={24} />
        <Paperclip className="text-[#54656f] dark:text-[#aebac1]" size={24} />
        <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg px-4 py-2 border-none">
          <span className="text-[#8696a0] text-[15px]">Mensagem</span>
        </div>
        <Mic className="text-[#54656f] dark:text-[#aebac1]" size={24} />
      </div>

      {/* iOS/Android Bottom Navigation Simulation */}
      {deviceSettings.type === 'ios' && (
        <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-center items-center bg-[#f0f2f5] dark:bg-[#202c33] z-10">
          <div className="w-1/3 h-1 bg-black dark:bg-white rounded-full"></div>
        </div>
      )}

      {deviceSettings.type === 'android' && (
        <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-center items-center gap-12 bg-[#f0f2f5] dark:bg-[#202c33] z-10">
          <div className="w-3 h-3 border-2 border-black dark:border-white rounded-sm opacity-60"></div>
          <div className="w-4 h-4 border-2 border-black dark:border-white rounded-full opacity-60"></div>
          <div className="w-0 h-0 border-l-[6px] border-l-black dark:border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent opacity-60 rotate-180"></div>
        </div>
      )}
    </div>
  );
};

export default Preview;
