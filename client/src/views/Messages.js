import React, { useState } from 'react';
import styles from '../css/Messages.module.css';

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Datos de ejemplo (puedes reemplazar con una API)
  const contacts = [
    {
      id: 1,
      name: 'Ana Gómez',
      img: '/images/tutor1.webp',
      lastMessage: '¡Hola! ¿Cuándo podemos tener la sesión?',
      time: '10:30 AM',
      unread: 2,
      messages: [
        { id: 1, text: 'Hola, estoy buscando ayuda con Cálculo.', from: 'them', time: '10:00 AM' },
        { id: 2, text: '¡Hola! ¿Cuándo podemos tener la sesión?', from: 'them', time: '10:30 AM' },
      ],
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      img: '/images/tutor2.webp',
      lastMessage: 'Entendido, te envío el material.',
      time: 'Ayer',
      unread: 0,
      messages: [
        { id: 1, text: '¿Puedes enviarme el material de Bases de Datos?', from: 'me', time: 'Ayer' },
        { id: 2, text: 'Entendido, te envío el material.', from: 'them', time: 'Ayer' },
      ],
    },
    {
      id: 3,
      name: 'María López',
      img: '/images/tutor3.webp',
      lastMessage: 'Gracias por la explicación de Física.',
      time: 'Lunes',
      unread: 0,
      messages: [
        { id: 1, text: 'Gracias por la explicación de Física.', from: 'them', time: 'Lunes' },
        { id: 2, text: '¡De nada! Avísame si necesitas más ayuda.', from: 'me', time: 'Lunes' },
      ],
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    // Simular envío (puedes conectar con una API aquí)
    const updatedContacts = contacts.map((contact) =>
      contact.id === selectedContact.id
        ? {
            ...contact,
            messages: [
              ...contact.messages,
              {
                id: contact.messages.length + 1,
                text: newMessage,
                from: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
            lastMessage: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
          }
        : contact
    );

    // Actualizar estado (en un caso real, esto se haría con una API)
    setNewMessage('');
    setSelectedContact(updatedContacts.find((c) => c.id === selectedContact.id));
  };

  return (
    <div className={styles.messagesWindow}>
      <div className={styles.container}>
        <div className={styles.messagesLayout}>
          {/* Lista de Contactos */}
          <div className={`${styles.contactsList} ${selectedContact ? styles.contactsHidden : ''}`}>
            <h1 className={styles.title}>
              <i className="bx bx-message-square-dots"></i>
              Mensajes
            </h1>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`${styles.contact} ${selectedContact?.id === contact.id ? styles.contactActive : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <img src={contact.img} alt={contact.name} className={styles.contactImg} />
                <div className={styles.contactInfo}>
                  <h3 className={styles.contactName}>{contact.name}</h3>
                  <p className={styles.contactLastMessage}>{contact.lastMessage}</p>
                </div>
                <div className={styles.contactMeta}>
                  <span className={styles.contactTime}>{contact.time}</span>
                  {contact.unread > 0 && (
                    <span className={styles.unreadBadge}>{contact.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Área de Chat */}
          <div className={`${styles.chatArea} ${selectedContact ? styles.chatVisible : ''}`}>
            {selectedContact ? (
              <>
                <div className={styles.chatHeader}>
                  <button
                    className={styles.backButton}
                    onClick={() => setSelectedContact(null)}
                  >
                    <i className="bx bx-arrow-back"></i>
                  </button>
                  <img src={selectedContact.img} alt={selectedContact.name} className={styles.chatHeaderImg} />
                  <h2 className={styles.chatHeaderName}>{selectedContact.name}</h2>
                </div>
                <div className={styles.chatMessages}>
                  {selectedContact.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${message.from === 'me' ? styles.messageSent : styles.messageReceived}`}
                    >
                      <p className={styles.messageText}>{message.text}</p>
                      <span className={styles.messageTime}>{message.time}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className={styles.messageForm}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className={styles.messageInput}
                    aria-label="Escribir mensaje"
                  />
                  <button type="submit" className={styles.sendButton}>
                    <i className="bx bx-send"></i>
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.noChat}>
                <img src="/images/lince-chat.png" alt="Lince Chat" className={styles.noChatImg} />
                <p className={styles.noChatText}>Selecciona un contacto para ver los mensajes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;