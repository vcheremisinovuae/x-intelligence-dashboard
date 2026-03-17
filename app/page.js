"use client";

import { useMemo, useState } from "react";

const topics = [
  { key: "all", label: "Все" },
  { key: "politics", label: "Политика" },
  { key: "history", label: "История" },
  { key: "ai", label: "ИИ" },
  { key: "finance", label: "Финансы" },
  { key: "philosophy", label: "Философия" },
];

const initialSources = [
  { id: 1, name: "Policy Atlas", handle: "@policyatlas", topic: "politics", trust: 92, active: true },
  { id: 2, name: "AI Frontier", handle: "@aifrontier", topic: "ai", trust: 95, active: true },
  { id: 3, name: "Capital Lens", handle: "@capitallens", topic: "finance", trust: 89, active: true },
  { id: 4, name: "History Archive", handle: "@historyarchive", topic: "history", trust: 91, active: true },
  { id: 5, name: "Agora Notes", handle: "@agoranotes", topic: "philosophy", trust: 86, active: false },
];

const initialPosts = [
  {
    id: 1,
    sourceId: 1,
    topic: "politics",
    title: "Европейская безопасность входит в фазу институциональной перестройки",
    content: "Разбор новых оборонных инициатив и долгосрочных политических сигналов.",
    summary: "Фокус смещается от громких заявлений к институциональному дизайну.",
    saved: true,
    importance: 94,
    timeLabel: "12 мин назад",
    url: "https://x.com",
  },
  {
    id: 2,
    sourceId: 2,
    topic: "ai",
    title: "Почему агентные системы переходят от demo к production",
    content: "Практический обзор evals, orchestration и надёжности инструментов.",
    summary: "Главный сдвиг — от эффектных демо к устойчивым production-пайплайнам.",
    saved: false,
    importance: 97,
    timeLabel: "28 мин назад",
    url: "https://x.com",
  },
  {
    id: 3,
    sourceId: 3,
    topic: "finance",
    title: "Как меняется настроение рынка после сигналов по ставке",
    content: "Краткий обзор влияния ожиданий по ставкам на риск-аппетит.",
    summary: "Рынок снова переоценивает скорость смягчения политики.",
    saved: false,
    importance: 86,
    timeLabel: "1 ч назад",
    url: "https://x.com",
  },
];

function cardStyle() {
  return {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 24,
  } as const;
}

export default function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sources, setSources] = useState(initialSources);
  const [posts, setPosts] = useState(initialPosts);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [newTopic, setNewTopic] = useState("politics");

  const enrichedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      source: sources.find((s) => s.id === post.sourceId),
    }));
  }, [posts, sources]);

  const filteredPosts = useMemo(() => {
    return enrichedPosts.filter((post) => {
      const matchesTopic = selectedTopic === "all" || post.topic === selectedTopic;
      const matchesSaved = !savedOnly || post.saved;
      const haystack = `${post.title} ${post.content} ${post.summary} ${post.source?.name || ""}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesTopic && matchesSaved && matchesQuery;
    });
  }, [enrichedPosts, selectedTopic, savedOnly, query]);

  function toggleSaved(postId: number) {
    setPosts((current) => current.map((post) => (post.id === postId ? { ...post, saved: !post.saved } : post)));
  }

  function toggleSource(sourceId: number) {
    setSources((current) => current.map((source) => (source.id === sourceId ? { ...source, active: !source.active } : source)));
  }

  function addSource() {
    if (!name.trim() || !handle.trim()) return;

    setSources((current) => [
      {
        id: Date.now(),
        name: name.trim(),
        handle: handle.trim().startsWith("@") ? handle.trim() : `@${handle.trim()}`,
        topic: newTopic,
        trust: 80,
        active: true,
      },
      ...current,
    ]);

    setName("");
    setHandle("");
    setNewTopic("politics");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-block", padding: "8px 12px", borderRadius: 999, background: "#1e293b", fontSize: 12, marginBottom: 12 }}>
              Trusted X Intelligence
            </div>
            <h1 style={{ margin: 0, fontSize: 40 }}>Signal from trusted sources</h1>
            <p style={{ color: "#94a3b8", maxWidth: 760 }}>
              Минимальная версия приложения: темы, фильтр, сохранение постов и ручное добавление trusted sources.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div style={{ ...cardStyle(), padding: 20 }}>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>Источники</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{sources.length}</div>
          </div>
          <div style={{ ...cardStyle(), padding: 20 }}>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>Активные</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{sources.filter((s) => s.active).length}</div>
          </div>
          <div style={{ ...cardStyle(), padding: 20 }}>
            <div style={{ color: "#94a3b8", fontSize: 14 }}>Сохранено</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{posts.filter((p) => p.saved).length}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div style={{ ...cardStyle(), padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>Лента</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {topics.map((topic) => (
                <button
                  key={topic.key}
                  onClick={() => setSelectedTopic(topic.key)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid #334155",
                    background: selectedTopic === topic.key ? "white" : "#020617",
                    color: selectedTopic === topic.key ? "#020617" : "white",
                    cursor: "pointer",
                  }}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по ленте"
                style={{
                  flex: 1,
                  minWidth: 220,
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "white",
                }}
              />
              <button
                onClick={() => setSavedOnly((v) => !v)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #334155",
                  background: "#020617",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {savedOnly ? "Только сохранённое" : "Все посты"}
              </button>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {filteredPosts.map((post) => (
                <div key={post.id} style={{ ...cardStyle(), padding: 18, background: "#020617" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 6 }}>
                        {post.source?.name} · {post.source?.handle} · {post.timeLabel}
                      </div>
                      <h3 style={{ margin: "0 0 8px 0" }}>{post.title}</h3>
                      <p style={{ color: "#94a3b8" }}>{post.content}</p>
                    </div>
                    <div style={{ fontSize: 13, color: "#cbd5e1" }}>signal {post.importance}</div>
                  </div>

                  <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "#0f172a", border: "1px solid #1e293b" }}>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>AI summary</div>
                    <div>{post.summary}</div>
                  </div>

                  <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        background: "white",
                        color: "#020617",
                      }}
                    >
                      Открыть оригинал
                    </a>
                    <button
                      onClick={() => toggleSaved(post.id)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid #334155",
                        background: "#020617",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      {post.saved ? "Убрать из сохранённого" : "Сохранить"}
                    </button>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div style={{ padding: 20, borderRadius: 16, border: "1px dashed #334155", color: "#94a3b8" }}>
                  Ничего не найдено.
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <div style={{ ...cardStyle(), padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>Добавить источник</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Название"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #334155", background: "#020617", color: "white" }}
                />
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@handle"
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #334155", background: "#020617", color: "white" }}
                />
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #334155", background: "#020617", color: "white" }}
                >
                  {topics.filter((t) => t.key !== "all").map((topic) => (
                    <option key={topic.key} value={topic.key}>{topic.label}</option>
                  ))}
                </select>
                <button
                  onClick={addSource}
                  style={{ padding: "12px 14px", borderRadius: 12, background: "white", color: "#020617", cursor: "pointer" }}
                >
                  Добавить источник
                </button>
              </div>
            </div>

            <div style={{ ...cardStyle(), padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>Trusted sources</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {sources.map((source) => (
                  <div key={source.id} style={{ padding: 14, borderRadius: 16, border: "1px solid #1e293b", background: "#020617" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{source.name}</div>
                        <div style={{ color: "#94a3b8", fontSize: 14 }}>{source.handle}</div>
                        <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>{source.topic}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div>{source.trust}%</div>
                        <button
                          onClick={() => toggleSource(source.id)}
                          style={{
                            marginTop: 8,
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #334155",
                            background: "#020617",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          {source.active ? "Выключить" : "Включить"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
