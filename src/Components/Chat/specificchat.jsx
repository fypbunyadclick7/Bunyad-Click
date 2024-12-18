import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBold,
  faItalic,
  faPaperclip,
  faTimes,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import io from "socket.io-client";
import { uploadToCloudinary } from "../../utils/cloudinaryService";

const socket = io("http://localhost:5000", {
  auth: {
    apiKey: process.env.REACT_APP_API_KEY,
  },
});

const SpecificChats = ({ selectedChat, onBack, showBackArrow }) => {
  const userId = Cookies.get("userId");
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const conversationId = selectedChat?._id;

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!conversationId || !userId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/chat/getMessages/${conversationId}/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        setMessages(res.data.messages || []);
        // socket.emit("joinConversation", conversationId);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [conversationId, userId]);

  // Scroll to bottom on message change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      // Prevent double insert on sender side
      if (message.sender === userId) return;

      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === message._id);
        if (!exists) {
          return [...prev, message];
        }
        return prev;
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [conversationId, userId]);

  useEffect(() => {
    if (conversationId) {
      socket.emit("joinConversation", conversationId);
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!conversationId || (!newMessage.trim() && !previewFile)) return;

    let formattedMessage = newMessage;
    if (isBold) formattedMessage = `<b>${formattedMessage}</b>`;
    if (isItalic) formattedMessage = `<i>${formattedMessage}</i>`;

    const attachment = previewFile ? previewFile : null;

    const messageData = {
      conversationId,
      sender: userId,
      content: formattedMessage,
      attachment,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/chat/sendMessage`,
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      const newMsg = res.data.data;

      // Add message to sender UI
      setMessages((prev) => [...prev, newMsg]);

      // Emit to others
      socket.emit("newMessage", {
        conversationId,
        message: newMsg,
      });

      setNewMessage("");
      setPreviewFile(null);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = await uploadToCloudinary(file);
      setPreviewFile(fileURL);
    }
  };

  return (
    <div className="chat-window">
      {selectedChat ? (
        <>
          <div className="chat-header">
            {showBackArrow && (
              <FontAwesomeIcon
                icon={faArrowLeft}
                size="lg"
                style={{ marginRight: "10px", cursor: "pointer" }}
                onClick={onBack}
              />
            )}
            <img
              src={
                selectedChat.otherParticipant?.profilePic || "./assets/logo.png"
              }
              alt="User"
              className="chat-avatar"
            />
            <div className="chat-info">
              <h4>{selectedChat.otherParticipant?.name}</h4>
              <p>Online</p>
            </div>
          </div>

          <div ref={chatContainerRef} className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat-message ${
                  msg.sender === userId ? "self" : "other"
                } ${msg.attachment ? "image-msg" : ""}`}
              >
                {msg.attachment ? (
                  <img
                    src={msg.attachment}
                    alt="Attachment"
                    className="chat-image"
                  />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                )}
              </div>
            ))}
          </div>

          {previewFile && (
            <div className="preview-container">
              <img
                src={previewFile}
                alt="Preview"
                style={{
                  width: "180px",
                  height: "120px",
                  borderRadius: "10px",
                }}
              />
              <FontAwesomeIcon
                icon={faTimes}
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={() => setPreviewFile(null)}
              />
            </div>
          )}

          <div className="chat-footer">
            <FontAwesomeIcon
              icon={faPaperclip}
              style={{ margin: "15px 8px", cursor: "pointer" }}
              onClick={() => document.getElementById("file-upload").click()}
            />
            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <FontAwesomeIcon
              icon={faBold}
              style={{
                margin: "15px 8px",
                cursor: "pointer",
                color: isBold ? "blue" : "black",
              }}
              onClick={() => setIsBold(!isBold)}
            />
            <FontAwesomeIcon
              icon={faItalic}
              style={{
                margin: "15px 8px",
                cursor: "pointer",
                color: isItalic ? "blue" : "black",
              }}
              onClick={() => setIsItalic(!isItalic)}
            />
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <FontAwesomeIcon
              icon={faPaperPlane}
              style={{
                color: "var(--avatar-bg-color)",
                margin: "15px 8px",
                cursor: "pointer",
              }}
              onClick={handleSendMessage}
            />
          </div>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="text-center p-4">
            <img
              src="./assets/logo.png"
              alt="Logo"
              className="mb-3"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                display: "block",
                margin: "0 auto",
              }}
            />
            <p className="h5 font-weight-bold text-dark">
              BunyadClick Chat App
            </p>
            <p className="text-muted">
              Send and Receive Messages With BunyadClick
            </p>
            <p className="text-muted">Select a chat to view messages</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificChats;
