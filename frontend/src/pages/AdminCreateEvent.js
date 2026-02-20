import { useState } from "react";
import api from "../api/axios";
import "./AdminCreateEvent.css";

export default function AdminCreateEvent({ onEventCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
  });
  const [toast, setToast] = useState(null);
  const [type, setType] = useState("success");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!form.title) {
      setType("error");
      setToast("Please enter a title first!");
      setTimeout(() => setToast(null), 2500);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/ai/generate", {
        title: form.title,
        type: "event"
      });
      setForm(prev => ({ ...prev, description: response.data.content }));
      setType("success");
      setToast("✨ AI generated description!");
    } catch {
      setType("error");
      setToast("AI generation failed. Check GROQ_API_KEY.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", form);

      setType("success");
      setToast("Event/Session created successfully ✅");

      // ✅ Re-fetch full events from backend
      if (onEventCreated) {
        onEventCreated();
      }

      setForm({
        title: "",
        description: "",
        date: "",
        venue: "",
      });

    } catch {
      setType("error");
      setToast("Failed to create Event/Session 🚫");
    } finally {
      setTimeout(() => setToast(null), 2500);
    }
  };


  return (
    <>
      <form onSubmit={submit}>
        <h2>Create Event/Session</h2>

        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <button
          type="button"
          className="ai-gen-btn"
          onClick={handleAIGenerate}
          disabled={isGenerating}
          style={{ marginBottom: '1rem' }}
        >
          {isGenerating ? "✨ Generating..." : "✨ AI Generate Description"}
        </button>

        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Venue"
          value={form.venue}
          onChange={e => setForm({ ...form, venue: e.target.value })}
        />
        <button type="submit">Add Event/Session</button>
      </form>

      {toast && <div className={`toast ${type}`}>{toast}</div>}
    </>
  );
}
