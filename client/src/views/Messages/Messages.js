import React, { useState, useEffect } from 'react';
import styles from './Messages.module.css';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);

  // Función para cargar los contactos desde la API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener token de localStorage
        const response = await fetch('http://localhost:5000/api/mensajes/ver', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          // Ordenar los contactos por el último mensaje (más reciente primero)
          const sortedContacts = data.data.sort((a, b) => {
            const lastMessageA = new Date(a.mensajes[a.mensajes.length - 1]?.fecha_hora || 0);
            const lastMessageB = new Date(b.mensajes[b.mensajes.length - 1]?.fecha_hora || 0);
            return lastMessageB - lastMessageA;
          });
          setContacts(sortedContacts); // Establecer los contactos de la API
        } else {
          console.error('Error al obtener los contactos');
        }
      } catch (err) {
        console.error('Error en la llamada a la API:', err);
        setError('Error al obtener los contactos');
      }
    };

    fetchContacts();

    // Polling: cada 5 segundos se hace una consulta para actualizar los mensajes
    const intervalId = setInterval(fetchContacts, 5000); // Polling cada 5 segundos

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  // Función para enviar un mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          destinatario_id: selectedContact.contacto_id,
          destinatario_tipo: selectedContact.contacto_tipo,
          texto: newMessage,
          archivo_adjunto: null, // Si se requiere un archivo adjunto, agregarlo aquí
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        // Actualizar los mensajes localmente después de enviar
        const updatedContacts = contacts.map((contact) => {
          if (contact.contacto_id === selectedContact.contacto_id) {
            return {
              ...contact,
              mensajes: [
                ...contact.mensajes,
                {
                  id: responseData.data.id,
                  texto: newMessage,
                  es_mio: true,
                  fecha_hora: new Date().toISOString(),
                },
              ],
              lastMessage: newMessage,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: 0,
            };
          }
          return contact;
        });
        setContacts(updatedContacts);
        setNewMessage('');
      } else {
        console.error('Error al enviar mensaje:', responseData.message);
        setError('Error al enviar mensaje');
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar mensaje');
    }
  };

  // Función para obtener mensajes de un contacto seleccionado
  const getMessagesForContact = (contact) => {
    return contact.mensajes.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)); // Ordenar los mensajes de más antiguo a más reciente
  };

  // Función para actualizar los mensajes cuando se recibe un nuevo mensaje en el chat
  useEffect(() => {
    const fetchMessagesForSelectedContact = async () => {
      if (!selectedContact) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/mensajes/${selectedContact.contacto_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          const updatedContacts = contacts.map((contact) => {
            if (contact.contacto_id === selectedContact.contacto_id) {
              return {
                ...contact,
                mensajes: data.data.mensajes,
              };
            }
            return contact;
          });
          setContacts(updatedContacts);
        } else {
          console.error('Error al obtener los mensajes');
        }
      } catch (err) {
        console.error('Error en la llamada a la API para mensajes:', err);
      }
    };

    // Polling para mensajes de un contacto seleccionado
    const intervalId = setInterval(fetchMessagesForSelectedContact, 5000); // Polling cada 5 segundos

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
  }, [selectedContact, contacts]);

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
            {error && <p className={styles.error}>{error}</p>}
            {contacts.length === 0 && !error && <p>No tienes mensajes.</p>}
            {contacts.map((contact) => (
              <div
                key={contact.contacto_id}
                className={`${styles.contact} ${selectedContact?.contacto_id === contact.contacto_id ? styles.contactActive : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <img src={'/images/Profile.png'} className={styles.contactImg} />
                <div className={styles.contactInfo}>
                  <h3 className={styles.contactName}>{contact.contacto_nombre}</h3>
                  <p className={styles.contactLastMessage}>
                    {contact.lastMessage || 'No hay mensajes aún.'}
                  </p>
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
                    <span className={styles.backButtonText}>Volver</span>
                  </button>
                  <img src={selectedContact.img || '/images/default-avatar.webp'} className={styles.chatHeaderImg} />
                  <h2 className={styles.chatHeaderName}>{selectedContact.contacto_nombre}</h2>
                </div>
                <div className={styles.chatMessages}>
                  {getMessagesForContact(selectedContact).map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${message.es_mio ? styles.messageSent : styles.messageReceived}`}
                    >
                      <p className={styles.messageText}>{message.texto}</p>
                      <span className={styles.messageTime}>{new Date(message.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
