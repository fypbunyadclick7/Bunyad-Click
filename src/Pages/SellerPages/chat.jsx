import React, { useState } from "react";
import SellerNavbar from "../../Components/sellerNavbar";
import AllChats from "../../Components/Chat/allchats";
import SpecificChats from "../../Components/Chat/specificchat";

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ overflow: "hidden", height: "100vh" }}>
      <SellerNavbar />
      <div
        className="row"
        style={{
          display: "flex",
          flexDirection: isMobileView ? "column" : "row",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {!selectedChat || !isMobileView ? (
          <div
            className={isMobileView ? "col" : "col-md-3"}
            style={{
              display: selectedChat && isMobileView ? "none" : "block",
            }}
          >
            <AllChats onSelectChat={setSelectedChat} />
          </div>
        ) : null}

        {(selectedChat || !isMobileView) && (
          <div
            className={isMobileView ? "col" : "col-md-9"}
            style={{
              display: !selectedChat && isMobileView ? "none" : "block",
            }}
          >
            <SpecificChats
              selectedChat={selectedChat}
              onBack={() => setSelectedChat(null)}
              showBackArrow={isMobileView}
            />
          </div>
        )}
      </div>
    </div>
  );
}

