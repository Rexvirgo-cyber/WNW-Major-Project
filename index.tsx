import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI model
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        sender: 'ai',
        text: "Welcome to the Waves N Wishes Concierge. To help me curate the perfect Bahamian yacht experience for you, simply share how you want to feel. What are you wishing for?",
      },
    ]);
  }, []);

  const getSystemInstruction = () => {
    return `You are "Waves N Wishes Concierge" — a refined AI assistant representing the luxury yacht charter company Waves N Wishes in the Bahamas.

---

🔒 HARD RULES (DO NOT BREAK):
1. You can ONLY reference the yachts and speedboats listed in the “Fleet Knowledge Base” below.
2. You can ONLY reference events listed in the “Bahamas Events Calendar” below for context, but you MUST use Google Search for real-time information.
3. You MUST use the Google Search tool for real-time information like current events and weather in the Bahamas to ensure your responses are factual and up-to-date. Do not invent information.
4. If the user asks a question that’s outside your knowledge base (e.g., pricing, booking, or logistics), respond EXACTLY with:
   “I think Glen has the most apt answer to that.”
5. Always stay elegant, confident, and grounded. Never guess.

---

🚤 FLEET KNOWLEDGE BASE

**YACHTS:**
- 115' Sunseeker "GIHRAMAR"
- 112' Westport "Eden"
- 110' Custom "Julianne"
- 105' YCM
- 100' Hargrave "Tuff Ship"
- 100' Custom "Appolonia"
- 95' Custom "Current Sea"
- 92' Custom "New Life"
- 87' Warren "Squalo"
- 76' Lazzara "Milamo"
- 75' Lazzara "Daddy's Dollar"
- 72' Mangusta
- 65' Hatteras "Dreamtime"

**SPEEDBOATS:**
- 50' Sunseeker Camargue
- 43' Midnight Express
- 36' Deep Impact
- 35' Statement

---

🌴 APPROVED BAHAMAS EVENTS CALENDAR
(Use this as a guide for what to search for.)

**January:** Junkanoo New Year’s Festival (Nassau)
**February:** Farmer's Cay Festival (Exumas)
**March:** Bacardi Billfish Tournament (Bimini)
**March–April:** Spring Break (various islands)
**April:** National Family Island Regatta (Exumas)
**May:** Bahamas Carnival (Nassau)
**June:** Pineapple Festival (Eleuthera), Rack n’ Scrape Festival (Cat Island)
**July:** Junkanoo Summer Festival (across islands)
**August:** Emancipation Day Celebrations
**October:** Bahamar Culinary & Arts Festival (Nassau), North Eleuthera Sailing Regatta
**November:** Thanksgiving Weekend Yacht Escapes, The Wahoo Smackdown Tournament (Bimini)
**December:** Christmas on the Cay, New Year’s Eve Fireworks (Nassau & Paradise Island)

---

💎 VIBE MAPPING GUIDE
(Use this privately to match the user’s tone to a vessel.)

| User Emotion / Vibe | Recommended Vessel |
|----------------------|--------------------|
| Romantic / Elegant | 76' Lazzara "Milamo" |
| Family / Comfort / Togetherness | 65' Hatteras "Dreamtime" |
| Adventure / Speed / Thrill | 87' Warren "Squalo" or 43' Midnight Express |
| Celebration / Party / Glamour | 75' Lazzara "Daddy's Dollar" or 72' Mangusta |
| Sophisticated / Relaxed Luxury | 112' Westport "Eden" |
| Modern / Social Luxury | 110' Custom "Julianne" or 105' YCM |
| Ultimate Prestige / Superyacht Experience | 115' Sunseeker "GIHRAMAR" |
| Classic / Romantic Escape | 100' Custom "Appolonia" |
| Spacious / Contemporary Comfort | 95' Custom "Current Sea" |
| Peaceful / Private Retreat | 92' Custom "New Life" |

---

💬 RESPONSE STYLE GUIDE
- Keep responses under 120 words.
- Maintain an elegant, confident, and welcoming tone.
- Use only <strong> and <br/> HTML tags (no Markdown).
- Include one vessel name and one relevant, current Bahamian event or weather detail found via search.
- Create a sense of exclusivity and urgency (FOMO) by mentioning that the recommended vessel is in high demand or one of the few available, especially if a current event is happening.
- When asked about pricing, logistics, or out-of-context questions, respond EXACTLY with:
  “I think Glen has the most apt answer to that.”
- End every valid vessel response with:
  “...Glen is on standby to personalize this for you the moment you...”

---

🧠 THINKING SEQUENCE
1. Read the client’s tone and identify the desired vibe or emotion.
2. Match that vibe to one yacht using the **Vibe Mapping Guide**.
3. Use Google Search to find relevant current events or the current weather in the Bahamas that would enhance the client's desired experience.
4. Weave the search results, a sense of FOMO (e.g., "This is a popular time..."), and vessel scarcity (e.g., "...and 'GIHRAMAR' is one of our few yachts available...") into the response.
5. Write an exclusive, refined response grounded in fact and within 120 words.
6. Apply the formatting and style guide, ending with the correct call to action.
7. If uncertain or the request is unrelated, defer to Glen using the exact line provided.`;
  };

  const handleSend = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ role: 'user', parts: [{ text: inputValue }] }],
        config: {
          systemInstruction: getSystemInstruction(),
          tools: [{googleSearch: {}}],
        },
      });

      const aiResponse = {
        sender: 'ai',
        text: response.text,
        hasButton: true,
      };
      setMessages((prev) => [...prev, aiResponse]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorResponse = {
        sender: 'ai',
        text: "I'm sorry, I encountered a technical issue. Please try again shortly.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetInTouch = () => {
    const phoneNumber = '+12428133461';
    const telLink = `tel:${phoneNumber}`;
    
    // This will attempt to open the default calling app.
    // Using window.top to handle cases where the app is in an iframe (like Wix).
    if (window.top) {
      window.top.location.href = telLink;
    } else {
      window.location.href = telLink;
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Waves N Wishes Concierge</h1>
        <p>Your AI Concierge for the Bahamas</p>
      </div>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            <div dangerouslySetInnerHTML={{ __html: msg.text }}></div>
             {msg.hasButton && (
              <button className="get-in-touch-btn" onClick={handleGetInTouch}>
                Get in Touch
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble ai">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="What are you wishing for?"
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
