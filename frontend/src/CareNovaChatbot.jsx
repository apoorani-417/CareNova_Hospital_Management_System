import React, { useState } from "react";

function CareNovaChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I’m CareNova AI. How can I help you today?",
    },
  ]);

  const handleSend = async () => {
    const userMessage = message.trim();

    if (!userMessage || isLoading) return;

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "Sorry, I could not generate a response right now.",
        },
      ]);
    } catch (error) {
      console.error("CareNova AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Sorry, I’m unable to connect to CareNova AI right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center text-3xl hover:bg-blue-700 transition"
          title="Open CareNova AI"
        >
          🩺
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-blue-600 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl">
                🩺
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  CareNova AI
                </h2>

                <p className="text-xs text-blue-100">
                  Hospital Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-2xl hover:text-blue-200"
              title="Close"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm text-sm">
                  CareNova AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-white p-3 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                isLoading
                  ? "Waiting for CareNova AI..."
                  : "Type your message..."
              }
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />

            <button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CareNovaChatBot;