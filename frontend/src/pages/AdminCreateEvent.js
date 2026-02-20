import { useState } from "react";
import api from "../api/axios";
import "./AdminCreateEvent.css";

export default function AdminCreateEvent({ onEventCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    additional_info: "",
    conducted_by: ""
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

  const handleAIGenerateAdditionalInfo = async () => {
    if (!form.title) {
      setType("error");
      setToast("Please enter a title first!");
      setTimeout(() => setToast(null), 2500);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/ai/generate", {
        prompt: `Provide some practical "Additional Info" (like what to bring, prerequisites, or notes) for a college event titled: "${form.title}". Keep it brief.`,
        type: "chat"
      });
      setForm(prev => ({ ...prev, additional_info: response.data.response }));
      setType("success");
      setToast("✨ AI generated additional info!");
    } catch {
      setType("error");
      setToast("AI generation failed.");
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
        <label>Event Title</label>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <label>Description</label>
        <textarea
          placeholder="Detailed Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows="4"
        />
        <button
          type="button"
          className="ai-gen-btn"
          onClick={handleAIGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "✨ Generating..." : "✨ AI Generate Description"}
        </button>

        <label>Conducted By</label>
        <input
          placeholder="e.g., Guest Speaker Name"
          value={form.conducted_by}
          onChange={e => setForm({ ...form, conducted_by: e.target.value })}
        />

        <label>Additional Info</label>
        <textarea
          placeholder="e.g., Bring laptops, prerequisites..."
          value={form.additional_info}
          onChange={e => setForm({ ...form, additional_info: e.target.value })}
          rows="2"
        />
        <button
          type="button"
          className="ai-gen-btn"
          onClick={handleAIGenerateAdditionalInfo}
          disabled={isGenerating}
        >
          {isGenerating ? "✨ Generating..." : "✨ AI Generate Info"}
        </button>

        <label>Date & Venue</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
        </div>

        <button type="submit">Add Event/Session</button>
      </form>

      {toast && <div className={`toast ${type}`}>{toast}</div>}
    </>
  );
}
