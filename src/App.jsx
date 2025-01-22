// src/App.js
import React, { useState } from "react";

const App = () => {
  const [topic, setTopic] = useState("title");
  const [passage, setPassage] = useState("");

  // Hàm gửi thông điệp từ popup tới content.js để tự động điền thông tin
  const handleFillForm = () => {
    // Sử dụng chrome.tabs.query để lấy tab hiện tại và inject content.js
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id; // Lấy tabId từ tab hiện tại
      // Inject content.js vào tab hiện tại
      chrome.scripting
        .executeScript({
          target: { tabId: tabId },
          files: ["content.js"], // Tiêm content.js vào tab
        })
        .then(() => {
          // Gửi thông điệp tới content.js để điền thông tin
          chrome.tabs.sendMessage(tabId, {
            type: "AUTO_FILL",
            topic: topic,
            passage: passage,
          });
        })
        .catch((error) => {
          console.error("Failed to inject content script:", error);
        });
    });
  };

  return (
    // <div style={{ padding: "20px", width: "200px" }}>
    //   <h2>Auto Fill Form</h2>
    //   <input
    //     type="text"
    //     placeholder="Name"
    //     value={name}
    //     onChange={(e) => setName(e.target.value)}
    //     style={{ marginBottom: "10px", width: "100%" }}
    //   />
    //   <input
    //     type="email"
    //     placeholder="Email"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     style={{ marginBottom: "10px", width: "100%" }}
    //   />
    //   <button onClick={handleFillForm} style={{ width: "100%" }}>
    //     Auto Fill
    //   </button>
    // </div>

    <div className="min-w-[30rem] mx-auto p-[1.25rem] bg-gray-900">
      <div className="mb-7">
        <h1 className="mb-4 text-2xl font-extrabold text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            COUSERA EXTENSION
          </span>{" "}
          AUTO FILL.
        </h1>
      </div>
      <div className="mb-5">
        <label
          for="title"
          className="block mb-2 text-sm font-medium text-white"
        >
          Your Topic
        </label>
        <input
          type="text"
          className="shadow-sm border text-md rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-700 shadow-sm-light outline-none"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>
      <div className="mb-5">
        <label
          for="message"
          className="block mb-2 text-sm font-medium text-white"
        >
          Your Passage
        </label>
        <textarea
          id="message"
          rows="4"
          className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Leave a passage..."
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
        ></textarea>
      </div>
      <button
        onClick={handleFillForm}
        className="text-white transition-color duration-200 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 focus:ring-blue-800"
      >
        Submit
      </button>
    </div>
  );
};

export default App;
