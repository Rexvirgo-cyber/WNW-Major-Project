const e = React.createElement;

function App() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return e(
    "div",
    { className: "chat-container" },
    e("div", { className: "chat-header" },
      e("h1", null, "Waves N Wishes Concierge"),
      e("p", null, "How can I help you today?")
    ),
    e("div", { className: "message-list" },
      messages.map((m, i) =>
        e("div", { key: i, className: `message-bubble ${m.from}` }, m.text)
      )
    ),
    e("div", { className: "input-area" },
      e("input", {
        value: input,
        onChange: (ev) => setInput(ev.target.value),
        placeholder: "Type your message...",
      }),
      e("button", { onClick: sendMessage }, "Send")
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(e(App));
