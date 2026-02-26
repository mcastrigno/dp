import { useState, useEffect, useRef } from "react";

const DEFAULT_TAGS = {
  UI:       { bg: "#8B1A1A", text: "#fff" },
  Content:  { bg: "#4A2E1A", text: "#F5C800" },
  Feature:  { bg: "#C8A800", text: "#1a1a1a" },
  Question: { bg: "#2a4a1a", text: "#a8e47a" },
  Hosting:  { bg: "#1a3a5a", text: "#7ac8e4" },
  Later:    { bg: "#3a3a3a", text: "#aaa" },
};

const COLOR_PRESETS = [
  { bg: "#5a1a5a", text: "#e47ae4" },
  { bg: "#1a4a4a", text: "#7ae4e4" },
  { bg: "#3a4a1a", text: "#c4e47a" },
  { bg: "#4a3a1a", text: "#e4c47a" },
  { bg: "#1a1a5a", text: "#7a9ae4" },
  { bg: "#5a3a1a", text: "#e4a47a" },
];

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState([]);
  const [tagDefs, setTagDefs] = useState(DEFAULT_TAGS);
  const [input, setInput] = useState("");
  const [selectedTags, setSelectedTags] = useState(["Feature"]);
  const [filterTag, setFilterTag] = useState("All");
  const [filterStatus, setFilterStatus] = useState("open");
  const [sortDir, setSortDir] = useState("newest");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTags, setEditTags] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [showNewTag, setShowNewTag] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(COLOR_PRESETS[0]);
  const newTagInputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const r1 = await window.storage.get("dp-ideas");
        if (r1 && r1.value) setIdeas(JSON.parse(r1.value));
      } catch (e) {}
      try {
        const r2 = await window.storage.get("dp-tag-defs");
        if (r2 && r2.value) setTagDefs(JSON.parse(r2.value));
      } catch (e) {}
      setLoaded(true);
    }
    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    async function save() {
      try {
        await window.storage.set("dp-ideas", JSON.stringify(ideas));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 1500);
      } catch (e) { setSaveStatus("error"); }
    }
    save();
  }, [ideas, loaded]);

  useEffect(() => {
    if (!loaded) return;
    async function save() {
      try { await window.storage.set("dp-tag-defs", JSON.stringify(tagDefs)); }
      catch (e) {}
    }
    save();
  }, [tagDefs, loaded]);

  useEffect(() => {
    if (showNewTag) setTimeout(() => newTagInputRef.current?.focus(), 50);
  }, [showNewTag]);

  function toggleSelectTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.length > 1 ? prev.filter(t => t !== tag) : prev
        : [...prev, tag]
    );
  }

  function addIdea() {
    const text = input.trim();
    if (!text) return;
    setIdeas(prev => [{
      id: genId(), text, tags: [...selectedTags], done: false, createdAt: Date.now(),
    }, ...prev]);
    setInput("");
    inputRef.current?.focus();
  }

  function toggleDone(id) {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  function deleteIdea(id) {
    setIdeas(prev => prev.filter(i => i.id !== id));
  }

  function startEdit(idea) {
    setEditingId(idea.id);
    setEditText(idea.text);
    setEditTags(idea.tags ? [...idea.tags] : [idea.tag]);
  }

  function toggleEditTag(tag) {
    setEditTags(prev =>
      prev.includes(tag)
        ? prev.length > 1 ? prev.filter(t => t !== tag) : prev
        : [...prev, tag]
    );
  }

  function saveEdit(id) {
    setIdeas(prev => prev.map(i =>
      i.id === id ? { ...i, text: editText.trim() || i.text, tags: editTags } : i
    ));
    setEditingId(null);
  }

  function addNewTag() {
    const name = newTagName.trim();
    if (!name || tagDefs[name]) return;
    setTagDefs(prev => ({ ...prev, [name]: newTagColor }));
    setNewTagName("");
    setNewTagColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
    setShowNewTag(false);
  }

  function exportJSON() {
    setShowExport(v => !v);
  }

  function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed)) {
          setIdeas(parsed);
        } else {
          if (parsed.ideas) setIdeas(parsed.ideas);
          if (parsed.tagDefs) setTagDefs(parsed.tagDefs);
        }
      } catch {}
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const tagNames = Object.keys(tagDefs);

  let visible = ideas.filter(i => {
    const ideaTags = i.tags || [i.tag];
    const tagMatch = filterTag === "All" || ideaTags.includes(filterTag);
    const statusMatch = filterStatus === "all" || (filterStatus === "open" ? !i.done : i.done);
    return tagMatch && statusMatch;
  });
  if (sortDir === "oldest") visible = [...visible].reverse();

  const openCount = ideas.filter(i => !i.done).length;
  const doneCount = ideas.filter(i => i.done).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1a0a04 0%, #2d1506 40%, #1a0f04 100%)",
      fontFamily: "'Georgia', serif", padding: 0, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(139,26,26,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(200,168,0,0.06) 0%, transparent 50%)`,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "32px 20px 60px" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 8 }}>
            <div style={{ background: "#F5C800", color: "#8B1A1A", fontWeight: 900, fontSize: 22, padding: "6px 12px", letterSpacing: 1, borderRadius: 4 }}>DP</div>
            <h1 style={{ margin: 0, color: "#F5C800", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 400, letterSpacing: 3, textTransform: "uppercase", textShadow: "0 2px 20px rgba(245,200,0,0.3)" }}>Donnelly Place</h1>
          </div>
          <p style={{ color: "#9a7a4a", margin: 0, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>Site Development · Idea Board</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
            <span style={{ color: "#8B1A1A", fontSize: 12, background: "rgba(139,26,26,0.2)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(139,26,26,0.4)" }}>{openCount} open</span>
            <span style={{ color: "#666", fontSize: 12, background: "rgba(255,255,255,0.05)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)" }}>{doneCount} done</span>
            {saveStatus && (
              <span style={{ color: saveStatus === "error" ? "#e44" : "#6a9", fontSize: 12, opacity: 0.8 }}>
                {saveStatus === "saved" ? "✓ saved" : saveStatus === "copied" ? "✓ copied to clipboard" : saveStatus === "cleared" ? "✓ cleared" : "⚠ error"}
              </span>
            )}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(245,200,0,0.2)", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ color: "#666", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Tags:</span>
            {tagNames.map(tag => (
              <button key={tag} onClick={() => toggleSelectTag(tag)} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                border: selectedTags.includes(tag) ? "none" : "1px solid rgba(255,255,255,0.1)",
                fontWeight: 600, letterSpacing: 0.5, transition: "all 0.15s",
                background: selectedTags.includes(tag) ? tagDefs[tag].bg : "rgba(255,255,255,0.07)",
                color: selectedTags.includes(tag) ? tagDefs[tag].text : "#888",
                transform: selectedTags.includes(tag) ? "scale(1.05)" : "scale(1)",
              }}>{tag}</button>
            ))}
            <button onClick={() => setShowNewTag(v => !v)} title="Add new tag" style={{
              padding: "4px 10px", borderRadius: 20, fontSize: 16, cursor: "pointer",
              border: "1px dashed rgba(245,200,0,0.35)",
              background: showNewTag ? "rgba(245,200,0,0.1)" : "transparent",
              color: "#F5C800", fontWeight: 700, lineHeight: 1,
            }}>＋</button>
          </div>

          {showNewTag && (
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(245,200,0,0.2)", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
              <div style={{ color: "#9a7a4a", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Create New Tag</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                <input
                  ref={newTagInputRef}
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addNewTag(); if (e.key === "Escape") setShowNewTag(false); }}
                  placeholder="Tag name…"
                  maxLength={16}
                  style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(245,200,0,0.25)", borderRadius: 6, padding: "7px 12px", color: "#f0e8d0", fontSize: 13, outline: "none", fontFamily: "Georgia, serif", width: 140 }}
                />
                <span style={{ color: "#555", fontSize: 11 }}>Color:</span>
                {COLOR_PRESETS.map((c, i) => (
                  <button key={i} onClick={() => setNewTagColor(c)} style={{ width: 22, height: 22, borderRadius: "50%", padding: 0, border: newTagColor === c ? "2px solid #F5C800" : "2px solid transparent", background: c.bg, cursor: "pointer" }} />
                ))}
                {newTagName.trim() && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: newTagColor.bg, color: newTagColor.text }}>{newTagName.trim()}</span>}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={addNewTag} disabled={!newTagName.trim() || !!tagDefs[newTagName.trim()]} style={{ padding: "6px 16px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: newTagName.trim() && !tagDefs[newTagName.trim()] ? "#8B1A1A" : "#2a2a2a", color: "#F5C800" }}>Add Tag</button>
                <button onClick={() => setShowNewTag(false)} style={{ padding: "6px 14px", borderRadius: 6, background: "transparent", color: "#666", border: "1px solid #333", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                {tagDefs[newTagName.trim()] && newTagName.trim() && <span style={{ color: "#8B1A1A", fontSize: 11 }}>Tag already exists</span>}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addIdea(); }} placeholder="Type an idea and press Enter…"
              style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(245,200,0,0.25)", borderRadius: 6, padding: "10px 14px", color: "#f0e8d0", fontSize: 15, outline: "none", fontFamily: "Georgia, serif" }}
            />
            <button onClick={addIdea} style={{ background: "#8B1A1A", color: "#F5C800", border: "none", borderRadius: 6, padding: "10px 20px", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>+</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
            {["All", ...tagNames].map(tag => (
              <button key={tag} onClick={() => setFilterTag(tag)} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", border: "1px solid", borderColor: filterTag === tag ? "#8B1A1A" : "rgba(255,255,255,0.1)", background: filterTag === tag ? "rgba(139,26,26,0.3)" : "transparent", color: filterTag === tag ? "#F5C800" : "#666", fontWeight: filterTag === tag ? 700 : 400 }}>{tag}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["open", "done", "all"].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer", border: "1px solid", borderColor: filterStatus === s ? "#4A2E1A" : "rgba(255,255,255,0.1)", background: filterStatus === s ? "rgba(74,46,26,0.5)" : "transparent", color: filterStatus === s ? "#F5C800" : "#666" }}>{s}</button>
            ))}
            <button onClick={() => setSortDir(d => d === "newest" ? "oldest" : "newest")} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#777" }}>{sortDir === "newest" ? "↓ newest" : "↑ oldest"}</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.length === 0 && <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 14, fontStyle: "italic" }}>No ideas here yet — capture something above ↑</div>}
          {visible.map(idea => {
            const ideaTags = idea.tags || [idea.tag];
            const primaryTag = ideaTags[0];
            return (
              <div key={idea.id} style={{ background: idea.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", border: `1px solid ${idea.done ? "rgba(255,255,255,0.06)" : "rgba(245,200,0,0.12)"}`, borderLeft: `3px solid ${idea.done ? "#333" : tagDefs[primaryTag]?.bg || "#555"}`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 12, opacity: idea.done ? 0.5 : 1 }}>
                <button onClick={() => toggleDone(idea.id)} style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 2, border: `2px solid ${idea.done ? "#555" : "#8B1A1A"}`, background: idea.done ? "#333" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#F5C800", fontSize: 12, padding: 0 }}>{idea.done ? "✓" : ""}</button>
                <div style={{ flex: 1 }}>
                  {editingId === idea.id ? (
                    <div>
                      <input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveEdit(idea.id); if (e.key === "Escape") setEditingId(null); }} autoFocus
                        style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(245,200,0,0.3)", borderRadius: 4, padding: "6px 10px", color: "#f0e8d0", fontSize: 14, fontFamily: "Georgia, serif", outline: "none", marginBottom: 8, boxSizing: "border-box" }}
                      />
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>Toggle tags:</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {tagNames.map(t => (
                          <button key={t} onClick={() => toggleEditTag(t)} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer", border: editTags.includes(t) ? "none" : "1px solid rgba(255,255,255,0.1)", fontWeight: 600, background: editTags.includes(t) ? tagDefs[t].bg : "rgba(255,255,255,0.08)", color: editTags.includes(t) ? tagDefs[t].text : "#666" }}>{t}</button>
                        ))}
                        <button onClick={() => saveEdit(idea.id)} style={{ marginLeft: "auto", padding: "3px 12px", borderRadius: 20, background: "#8B1A1A", color: "#F5C800", border: "none", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ padding: "3px 10px", borderRadius: 20, background: "transparent", color: "#666", border: "1px solid #333", fontSize: 11, cursor: "pointer" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ color: idea.done ? "#555" : "#f0e8d0", fontSize: 14, lineHeight: 1.5, textDecoration: idea.done ? "line-through" : "none", display: "block", marginBottom: 5 }}>{idea.text}</span>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {ideaTags.map(t => <span key={t} style={{ padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 0.5, background: tagDefs[t]?.bg || "#333", color: tagDefs[t]?.text || "#fff" }}>{t}</span>)}
                      </div>
                    </div>
                  )}
                  {editingId !== idea.id && <div style={{ color: "#444", fontSize: 11, marginTop: 5 }}>{new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>}
                </div>
                {editingId !== idea.id && (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => startEdit(idea)} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 4, padding: "4px 8px", color: "#888", cursor: "pointer", fontSize: 12 }} title="Edit">✎</button>
                    <button onClick={() => deleteIdea(idea.id)} style={{ background: "rgba(139,26,26,0.2)", border: "none", borderRadius: 4, padding: "4px 8px", color: "#8B1A1A", cursor: "pointer", fontSize: 12 }} title="Delete">✕</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 28, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {ideas.length > 0 && (
            <button onClick={exportJSON} style={{ padding: "8px 20px", background: "rgba(245,200,0,0.1)", border: "1px solid rgba(245,200,0,0.3)", borderRadius: 6, color: "#F5C800", fontSize: 12, cursor: "pointer", letterSpacing: 0.5 }}>
              {showExport ? "Hide JSON" : "⎘ Export JSON"}
            </button>
          )}
          <label style={{ padding: "8px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#888", fontSize: 12, cursor: "pointer", letterSpacing: 0.5 }}>
            ↑ Import JSON
            <input type="file" accept=".json" onChange={importJSON} style={{ display: "none" }} />
          </label>
          <button onClick={async () => {
            try {
              await window.storage.delete("dp-ideas");
              await window.storage.delete("dp-tag-defs");
              setIdeas([]);
              setTagDefs(DEFAULT_TAGS);
              setSaveStatus("cleared");
              setTimeout(() => setSaveStatus(""), 2000);
            } catch(e) { setSaveStatus("error"); }
          }} style={{ padding: "8px 20px", background: "rgba(139,26,26,0.15)", border: "1px solid rgba(139,26,26,0.3)", borderRadius: 6, color: "#8B1A1A", fontSize: 12, cursor: "pointer", letterSpacing: 0.5 }}>
            ⚠ Clear All (Test)
          </button>
        </div>

        {showExport && (
          <div style={{ marginTop: 16 }}>
            <div style={{ color: "#9a7a4a", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              Select all and copy to save your data
            </div>
            <textarea
              readOnly
              value={JSON.stringify({ ideas, tagDefs }, null, 2)}
              onClick={e => e.target.select()}
              style={{
                width: "100%", height: 200, background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(245,200,0,0.2)", borderRadius: 6,
                color: "#f0e8d0", fontSize: 11, fontFamily: "monospace",
                padding: "10px", boxSizing: "border-box", resize: "vertical", outline: "none",
              }}
            />
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 40, color: "#2a1a08", fontSize: 11, letterSpacing: 2 }}>
          VENTURE INVESTMENTS, LLC · DONNELLY PLACE
        </div>
      </div>
    </div>
  );
}
