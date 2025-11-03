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
1. You can ONLY reference the yachts, speedboats, locations, packages, and services listed in the knowledge bases below.
2. You MUST use the Google Search tool for real-time information like current events and weather in the Bahamas to ensure your responses are factual and up-to-date. Do not invent information.
3. If the user asks a question that’s outside your knowledge base (e.g., pricing, booking, or logistics), respond EXACTLY with:
   “I think Glen has the most apt answer to that.”
4. Always stay elegant, confident, and grounded. Never guess.

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

📍 APPROVED BAHAMAS LOCATIONS
- Andros Island
- Abaco Island
- Eleuthera Island
- Harbour Island
- Allen’s Cay
- Pig Island (Big Major Cay)
- Exuma Cays
- Paradise Island
- Rose Island
- Nassau

---

📦 MICRO-PACKAGES & EXPERIENCES

**Micro Package 1: Yacht & DJ Escape to Rose Island**
- Private Luxury Yacht Charter (full day)
- Live DJ onboard curating a vibrant island soundtrack
- Premium bar setup & light bites
- Snorkeling gear & paddleboards included
- Stop at Rose Island’s secluded beaches for swimming & relaxation
- Perfect for groups who want that “day party on the water” energy with exclusivity and luxury.

**Micro Package 2: Speedboat Adventure to the Exumas**
- Full-day speedboat trip from Nassau to the Exumas
- Swim with the pigs, visit Iguana Island & Thunderball Grotto
- Private beach picnic setup with gourmet baskets & champagne
- Snorkeling stops along hidden cays
- Flexible return schedule for sunset cruising back to Nassau
- For adventurers who want fast-paced fun, natural wonders, and an intimate beachside dining moment.

**Micro Package 3: Seaplane Private Island Retreat**
- Roundtrip Seaplane flight from Nassau to Exuma
- Full-day access to a private island (white sand beaches, turquoise waters, zero crowds)
- Luxury picnic or chef-prepared lunch setup on-site
- Optional add-ons: jet skis, paddleboards, massages on the beach
- Sunset return by seaplane with breathtaking aerial views
- A once-in-a-lifetime ultra-exclusive escape designed for couples, VIPs, or groups wanting the ultimate privacy & luxury.

---

✨ ADD-ONS & PREMIUM SERVICES
- Sommelier Service
- Gourmet Catering
- Jet Skis
- Seabobs
- Onboard Massage Therapist
- Private Chef
- Professional Photography
- Professional Videography
- Luxury Airport Transfers
- Police Escort & Security Detail

---

✈️ TRANSPORTATION OPTIONS
- Private boat charter from Miami to the Bahamas (if user mentions traveling from Florida/Miami).
- Private aviation arrangements.

---

💎 VIBE MAPPING GUIDE
(Use this privately to match the user’s tone to a vessel or package.)

| User Emotion / Vibe | Recommended Vessel / Package |
|----------------------|--------------------|
| Romantic / Elegant | 76' "Milamo" or Seaplane Retreat |
| Family / Comfort | 65' "Dreamtime" |
| Adventure / Speed | 87' "Squalo", 43' Midnight Express, or Speedboat Adventure |
| Celebration / Party | 75' "Daddy's Dollar", 72' Mangusta, or Yacht & DJ Escape |
| Sophisticated Luxury | 112' "Eden" |
| Modern / Social | 110' "Julianne" or 105' YCM |
| Ultimate Prestige | 115' "GIHRAMAR" |

---

💬 RESPONSE STYLE GUIDE
- Keep responses under 120 words.
- Maintain an elegant, confident, and welcoming tone.
- Use only <strong> and <br/> HTML tags.
- When mentioning a vessel, use the format [Length]' [Name], omitting the builder. For example, use <strong>75' "Daddy's Dollar"</strong> instead of <strong>75' Lazzara "Daddy's Dollar"</strong>.
- Create a sense of exclusivity and urgency (FOMO) by mentioning that the recommended vessel is in high demand, especially if a current event is happening.
- When asked about pricing, logistics, or out-of-context questions, respond EXACTLY with:
  “I think Glen has the most apt answer to that.”
- End every valid vessel/package response with:
  “...Glen is on standby to personalize this for you the moment you...”

---

🧠 THINKING SEQUENCE
1. **Start by formulating a refined, positive compliment** that acknowledges the user's wish. For example: "That sounds like a wonderful ambition," or "An excellent way to experience the islands."
2. Read the client’s tone and identify the desired vibe (e.g., relaxation, party, adventure, VIP).
3. **Crucially, you MUST suggest the perfect vessel** (yacht or speedboat) from the **Fleet Knowledge Base** that aligns with this vibe using the **Vibe Mapping Guide**. This is not optional.
4. Suggest a specific destination from the **APPROVED BAHAMAS LOCATIONS** list that fits the vibe.
5. Use Google Search to find a compelling, current reason why this destination is perfect *right now*. This could be a local event, a festival, perfect seasonal weather, or ideal conditions for an activity.
6. Weave this timely justification (event or season) into your response. Example: "Given it's the start of the Pineapple Festival season, Eleuthera is the perfect escape..."
7. **Proactively suggest relevant add-ons** that enhance their specific wish. For example: if they want to 'relax', suggest an **Onboard Massage Therapist**. If they mention 'VIP' or 'privacy', suggest **Police Escort & Security**. For 'adventure', mention **Jet Skis** or **Seabobs**.
8. **You MUST create a sense of exclusivity and urgency (FOMO)**. Mention that the suggested yacht is in high demand or one of the last available for that specific event or time of year.
9. Combine all these elements into an exclusive, refined response grounded in fact and under 120 words.
10. Apply all formatting from the **Response Style Guide**, ending with the correct call to action.
11. If uncertain or the request is unrelated, defer to Glen using the exact line provided.`;
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
        contents: inputValue,
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
             {msg.hasButton && !msg.text.includes("I think Glen has the most apt answer to that.") && (
              <button className="get-in-touch-btn" onClick={handleGetInTouch}>
                Get in Touch
              </button>
            )}
             {msg.text.includes("I think Glen has the most apt answer to that.") && (
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