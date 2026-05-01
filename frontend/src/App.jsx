import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, addChatMessage } from "./store/interactionSlice";
import "./index.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const form = useSelector((state) => state.interaction.form);
  const chatMessages = useSelector((state) => state.interaction.chatMessages);

  const normalizeSentiment = (value) => {
    if (!value) return undefined;
    const lower = value.toLowerCase();
    if (lower.includes("positive")) return "Positive";
    if (lower.includes("negative")) return "Negative";
    return "Neutral";
  };

  const sendToAgent = async () => {
    if (!message.trim()) return;

    const userText = message;
    setMessage("");

    dispatch(addChatMessage({ role: "user", text: userText }));

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        message: userText,
        current_form: form,
      });

      const intent = res.data.intent;
      const data = res.data.data || {};
      const reply = res.data.reply || "Done.";

      if (intent === "log_interaction" || intent === "edit_interaction") {
        dispatch(
          updateForm({
            hcp_name: data.hcp_name || form.hcp_name,
            specialty: data.specialty || form.specialty,
            interaction_type: data.interaction_type || form.interaction_type,
            attendees: data.attendees || form.attendees,
            products_discussed:
              data.products_discussed || form.products_discussed,
            materials_shared: data.materials_shared || form.materials_shared,
            samples_distributed:
              data.samples_distributed || form.samples_distributed,
            sentiment: normalizeSentiment(data.sentiment) || form.sentiment,
            outcomes: data.outcomes || form.outcomes,
            follow_up_date: data.follow_up_date || form.follow_up_date,
            notes: data.notes || form.notes || userText,
          })
        );
      }

      if (intent === "summarize_interaction") {
        dispatch(updateForm({ outcomes: reply }));
      }

      if (intent === "extract_action_items") {
        dispatch(updateForm({ follow_up_date: reply }));
      }

      dispatch(addChatMessage({ role: "assistant", text: reply }));
    } catch (error) {
      console.error(error);
      dispatch(
        addChatMessage({
          role: "assistant",
          text: "AI error. Please check backend.",
        })
      );
    }
  };

  const saveInteraction = async () => {
    try {
      await axios.post(`${API_URL}/save`, form);

      dispatch(
        addChatMessage({
          role: "assistant",
          text: "✅ Interaction saved successfully in PostgreSQL.",
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        addChatMessage({
          role: "assistant",
          text: "Save failed. Please check backend/database.",
        })
      );
    }
  };

  return (
    <div className="page">
      <div className="main-layout">
        <section className="form-panel">
          <h2>Log HCP Interaction</h2>

          <h4>Interaction Details</h4>

          <div className="two-col">
            <div className="field">
              <label>HCP Name</label>
              <input
                value={form.hcp_name}
                readOnly
                placeholder="Search or select HCP..."
              />
            </div>

            <div className="field">
              <label>Interaction Type</label>
              <select value={form.interaction_type} disabled>
                <option>Meeting</option>
                <option>Call</option>
                <option>Email</option>
                <option>Conference</option>
              </select>
            </div>
          </div>

          <div className="two-col">
            <div className="field">
              <label>Date</label>
              <input type="date" value={form.date} readOnly />
            </div>

            <div className="field">
              <label>Time</label>
              <input type="time" value={form.time} readOnly />
            </div>
          </div>

          <div className="field">
            <label>Attendees</label>
            <input
              value={form.attendees}
              readOnly
              placeholder="Enter names or search..."
            />
          </div>

          <div className="field">
            <label>Topics Discussed</label>
            <textarea
              value={form.products_discussed}
              readOnly
              placeholder="Enter key discussion points..."
            />
          </div>

          <button className="link-btn">
            🎙 Summarize from Voice Note (Requires Consent)
          </button>

          <h4>Materials Shared / Samples Distributed</h4>

          <div className="mini-section">
            <div>
              <label>Materials Shared</label>
              <p>{form.materials_shared || "No materials added."}</p>
            </div>
            <button>🔍 Search/Add</button>
          </div>

          <div className="mini-section">
            <div>
              <label>Samples Distributed</label>
              <p>{form.samples_distributed || "No samples added."}</p>
            </div>
            <button>➕ Add Sample</button>
          </div>

          <h4>Observed/Inferred HCP Sentiment</h4>

          <div className="sentiment-row">
            {["Positive", "Neutral", "Negative"].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  checked={form.sentiment === item}
                  readOnly
                />
                {item}
              </label>
            ))}
          </div>

          <div className="field">
            <label>Outcomes</label>
            <textarea
              value={form.outcomes}
              readOnly
              placeholder="Key outcomes or agreements..."
            />
          </div>

          <div className="field">
            <label>Follow-up Actions</label>
            <textarea
              value={form.follow_up_date}
              readOnly
              placeholder="Enter next steps or tasks..."
            />
          </div>

          <button className="save-btn" onClick={saveInteraction}>
            Save Interaction
          </button>
        </section>

        <aside className="assistant-panel">
          <div className="assistant-header">
            <h3>🤖 AI Assistant</h3>
            <p>Log interaction via chat</p>
          </div>

          <div className="chat-area">
            <div className="assistant-help">
              Example: “Met Dr Priya, cardiologist, discussed CardioPlus,
              requested samples, follow up next Friday.”
            </div>

            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={msg.role === "user" ? "user-msg" : "assistant-msg"}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input-row">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe interaction..."
            />
            <button onClick={sendToAgent}>
              A<br />
              Log
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;