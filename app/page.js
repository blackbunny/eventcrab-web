"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [artist, setArtist] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState("");     // YYYY-MM-DD
  const [size, setSize] = useState(20);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0 });

  const fetchEvents = async (p = page) => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams();
      if (artist) qs.set("artist", artist);
      if (city) qs.set("city", city);
      if (startDate) qs.set("startDate", startDate);
      if (endDate) qs.set("endDate", endDate);
      qs.set("page", String(p));
      qs.set("size", String(size));

      const res = await fetch(`/api/events?${qs.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "API error");
      }
      const data = await res.json();
      setEvents(data?.events || []);
      setMeta({
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
      });
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchEvents(0);
  };

  useEffect(() => {
    // initial load is optional; uncomment to load something by default
    // fetchEvents(0);
  }, []);

  const canPrev = page > 0;
  const canNext = page + 1 < (meta.totalPages || 0);

  return (
      <div className="min-h-screen bg-gray-950 text-white">
        <header className="p-6 border-b border-white/10">
          <h1 className="text-2xl md:text-3xl font-bold">🎵 Global Concert Finder (Demo)</h1>
          <p className="text-sm text-white/60 mt-1">Artist/City + tarih aralığı ile arayın; sonuçları listeleyin ve detayına gidin.</p>
        </header>

        <main className="p-6 max-w-6xl mx-auto">
          <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-900/60 p-4 rounded-xl border border-white/10">
            <input
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist"
                className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 outline-none"
            />
            <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 outline-none"
            />
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 outline-none"
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-800 border border-white/10 outline-none"
            />
            <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[.98] transition"
            >
              Ara
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-white/70">Page size:</label>
              <select
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="bg-gray-800 border border-white/10 px-2 py-1 rounded"
              >
                {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <button
                  onClick={() => { setPage(0); fetchEvents(0); }}
                  className="text-sm px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 border border-white/10"
              >
                Uygula
              </button>
            </div>

            <div className="text-sm text-white/60">
              Toplam: {meta.totalElements ?? 0} • Sayfalar: {meta.totalPages ?? 0}
            </div>
          </div>

          {loading && <p className="mt-6 text-white/70">Yükleniyor…</p>}
          {error && <p className="mt-6 text-red-400">{error}</p>}

          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev) => (
                <li key={ev.id} className="bg-gray-900 border border-white/10 rounded-xl p-4 hover:border-white/20 transition">
                  <h3 className="font-semibold text-lg">{ev.name}</h3>
                  <p className="text-sm text-white/70 mt-1">{ev.date}{ev.time ? ` • ${ev.time}` : ""}</p>
                  <p className="text-sm text-white/60 mt-1">
                    {ev.venue} — {ev.city}{ev.country ? `, ${ev.country}` : ""}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/event/${ev.id}`} className="text-blue-400 hover:underline">Detay</Link>
                    {ev.url && (
                        <a href={ev.url} target="_blank" rel="noreferrer" className="text-white/70 hover:underline">
                          Bilet/Liste
                        </a>
                    )}
                  </div>
                </li>
            ))}
          </ul>

          {(meta.totalPages > 1) && (
              <div className="mt-6 flex justify-center items-center gap-3">
                <button
                    disabled={!canPrev}
                    onClick={() => { const p = page - 1; setPage(p); fetchEvents(p); }}
                    className={`px-3 py-2 rounded bg-gray-800 border border-white/10 ${!canPrev ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700"}`}
                >
                  ← Önceki
                </button>
                <span className="text-white/70 text-sm">Sayfa {page + 1} / {meta.totalPages}</span>
                <button
                    disabled={!canNext}
                    onClick={() => { const p = page + 1; setPage(p); fetchEvents(p); }}
                    className={`px-3 py-2 rounded bg-gray-800 border border-white/10 ${!canNext ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700"}`}
                >
                  Sonraki →
                </button>
              </div>
          )}
        </main>
      </div>
  );
}
