import React, { useState, useEffect } from "react";
import { MDBListGroup, MDBListGroupItem, MDBBadge } from "mdb-react-ui-kit";
import axios from "axios";
import Cookies from "js-cookie";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    apiKey: process.env.REACT_APP_API_KEY,
  },
});

export default function AllChats({ onSelectChat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  const userId = Cookies.get("userId");

  const filteredChats = conversations.filter(
    (chat) =>
      chat.otherParticipant?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/chat/getConversations/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  useEffect(() => {
    if (!selectedChat) {
      fetchConversations();
    }
  }, [selectedChat, userId]);

  // ✅ SOCKET listener for new messages
  useEffect(() => {
    const handleIncomingMessage = (data) => {
      const { message, conversationId } = data;

      setConversations((prevConversations) => {
        const updated = [...prevConversations];

        const index = updated.findIndex((conv) => conv._id === conversationId);

        if (index !== -1) {
          const isCurrentChatOpen = selectedChat === conversationId;

          updated[index] = {
            ...updated[index],
            lastMessage: message.content,
            lastMessageTime: message.createdAt || new Date(),
            unreadCount: isCurrentChatOpen
              ? 0
              : (updated[index].unreadCount || 0) + 1,
          };

          // Sort the updated array so the latest chat appears first
          updated.sort(
            (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
          );
        }

        return updated;
      });
    };

    socket.on("newMessage", handleIncomingMessage);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
    };
  }, [selectedChat]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat._id);
    if (onSelectChat) {
      onSelectChat(chat);
    }

    // ✅ Reset unread count on open
    setConversations((prev) =>
      prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c))
    );
  };

  return (
    <div>
      <h3 style={{ fontStyle: "oblique" }}>Chats</h3>
      <div
        className="custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
      >
        {/* Search Input */}
        <div className="sticky-top bg-white">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: "5px",
              marginRight: "10px",
            }}
          />
        </div>

        {/* Chat List */}
        <MDBListGroup style={{ paddingBottom: "6vh" }}>
          {filteredChats.map((chat, index) => (
            <MDBListGroupItem
              key={index}
              className="d-flex justify-content-between align-items-center"
              role="button"
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
                backgroundColor: selectedChat === chat._id ? "#e3f2fd" : "",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => handleChatClick(chat)}
            >
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "var(--avatar-bg-color)",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {chat.otherParticipant?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h6 className="mb-0">
                    {chat.otherParticipant?.name || "Unknown"}
                  </h6>
                  <small
                    className="text-muted"
                    dangerouslySetInnerHTML={{
                      __html:
                        chat.lastMessage?.length > 30
                          ? `${chat.lastMessage.slice(0, 30)}...`
                          : chat.lastMessage || "No messages",
                    }}
                  />
                </div>
              </div>
              <div className="text-end">
                <small className="text-muted d-block">
                  {chat.lastMessageTime
                    ? new Date(chat.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </small>
                {chat.unreadCount > 0 && (
                  <MDBBadge color="danger" pill>
                    {chat.unreadCount}
                  </MDBBadge>
                )}
              </div>
            </MDBListGroupItem>
          ))}
        </MDBListGroup>
      </div>
    </div>
  );
}
