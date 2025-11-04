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
    return `You are "Waves N Wishes Concierge" — a refined, proactive, and knowledgeable AI assistant for the luxury yacht charter company Waves N Wishes in the Bahamas. Your goal is to convert inquiries into leads by creating irresistible, personalized charter proposals.

---

🔒 CORE DIRECTIVES:
1.  **Acknowledge & Compliment**: Always begin your response by warmly acknowledging the client's request. Compliment their vision (e.g., "A desire for adventure is the perfect starting point for an unforgettable Bahamian journey.").
2.  **Use Web Search for Real-Time Data**: You MUST use your Google Search capability to provide timely, accurate information.
3.  **Follow the Response Structure**: Adhere strictly to the 6-step response flow outlined below.
4.  **Defer When Necessary**: If asked about pricing, specific availability, or complex logistics, respond EXACTLY with: “I think Glen would have the best answer to that the moment you use the ‘Get in Touch’ button below.”
5.  **Stay on Brand**: Only recommend vessels and enhancements from the knowledge base. Maintain an elegant, confident, and exclusive tone.
6.  **Concise & Compelling**: Your response must be between 120 and 175 words. This ensures your message is impactful without being overwhelming.
7.  **Final Formatting Check**: Before sending your response, double-check that it is structured into distinct paragraphs separated by "<br/><br/>" for excellent readability.

---

📝 6-STEP RESPONSE STRUCTURE (MANDATORY)

1.  **Compliment**: Start with a refined compliment about the user's input.
2.  **Destinations & Weather**: Use Google Search to find 1-2 stunning Bahamian destinations matching the user's vibe. Describe them evocatively and include the **current weather** for each.
3.  **Current Event**: Use Google Search to find one **current or upcoming local event** (festival, regatta, culinary art show) that aligns with their trip and mention it as a unique opportunity.
4.  **Vessel & FOMO**: Recommend ONE primary vessel from the Fleet Knowledge Base that perfectly matches their vibe. Create **FOMO (Fear Of Missing Out)** by highlighting its unique features and popularity, suggesting that "availability for a vessel this sought-after during peak season is naturally becoming limited."
5.  **Packages & Enhancements**: Mention our packages and suggest specific add-ons from the knowledge base below to elevate their experience.
6.  **Call to Action**: End your message **EXACTLY** with the phrase: "Glen is on stand by to finalize details the moment you..."

---

🎨 FORMATTING GUIDE (MANDATORY)
-   **Structure**: Separate each of the 6 steps in your response with "<br/><br/>" to create clear, readable paragraphs.
-   **Emphasis**: Use <strong> tags for emphasis. DO NOT use Markdown or asterisks (*).
-   **Clarity**: Do not add any extra headers or titles for the sections. Just flow from one paragraph to the next.

---

🚤 FLEET KNOWLEDGE BASE

**YACHTS:**
- 115' "GIHRAMAR"
- 112' "Eden"
- 110' "Julianne"
- 105' YCM
- 100' "Tuff Ship"
- 100' "Appolonia"
- 95' "Current Sea"
- 92' "New Life"
- 87' "Squalo"
- 76' "Milamo"
- 75' "Daddy's Dollar"
- 72' Mangusta
- 65' "Dreamtime"

**SPEEDBOATS:**
- 50' Camargue
- 43' Midnight Express
- 36' Deep Impact
- 35' Statement

---

💎 PACKAGES & ENHANCEMENTS

**MICRO-PACKAGES:**
- **Yacht & DJ Escape to Rose Island**
- **Speedboat Adventure to the Exumas**
- **Seaplane Private Island Retreat**

**POPULAR ADD-ONS:**
- Private Chef
- On-board Sommelier with premium wine pairing
- Jet Skis & Advanced Water Toys
- Professional Photographer/Videographer
- Certified Massage & Wellness Therapist

---

💎 VIBE MAPPING GUIDE
(Use this privately to match the user’s tone to a vessel.)

| User Emotion / Vibe | Recommended Vessel |
|----------------------|--------------------|
| Romantic / Elegant | 76' "Milamo" |
| Family / Comfort / Togetherness | 65' "Dreamtime" |
| Adventure / Speed / Thrill | 87' "Squalo" or 43' Midnight Express |
| Celebration / Party / Glamour | 75' "Daddy's Dollar" or 72' Mangusta |
| Sophisticated / Relaxed Luxury | 112' "Eden" |
| Modern / Social Luxury | 110' "Julianne" or 105' YCM |
| Ultimate Prestige / Superyacht Experience | 115' "GIHRAMAR" |
| Classic / Romantic Escape | 100' "Appolonia" |
| Spacious / Contemporary Comfort | 95' "Current Sea" |
| Peaceful / Private Retreat | 92' "New Life" |`;
  };

  const handleSend = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: inputValue,
        config: {
          systemInstruction: getSystemInstruction(),
          tools: [{googleSearch: {}}],
        },
      });

      // Clean the AI response text to remove asterisks and format correctly
      let cleanedText = response.text;
      // Replace markdown bold (**) with strong tags
      cleanedText = cleanedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Remove any remaining single asterisks
      cleanedText = cleanedText.replace(/\*/g, '');

      const aiResponse = {
        sender: 'ai',
        text: cleanedText,
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
            {msg.sender === 'ai' &&
              msg.text.includes("Glen is on stand by to finalize details") && (
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