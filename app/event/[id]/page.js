"use client";

import { useEffect, useState } from "react";

export default function EventDetailPage({ params }) {
    const { id } = params;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setErr("");
            try {
                const res = await fetch(`/api/event/${id}`);
                if (!res.ok) {
                    const e = await res.json().catch(() => ({}));
                    throw new Error(e?.error || "API error");
                }
                const data = await res.json();
                setEvent(data);
            } catch (e) {
                setErr(String(e.message || e));
            } finally {
                setLoading(false);
            }
        };
        if (id) run();
    }, [id]);

    if (loading) return <div className="p-6 text-white/70">Yükleniyor…</div>;
    if (err) return <div className="p-6 text-red-400">{err}</div>;
    if (!event) return <div className="p-6 text-white/70">Etkinlik bulunamadı.</div>;

    const venue = event?.venue || {};
    const venueAddr = [venue?.name, venue?.city?.name, venue?.country?.name].filter(Boolean).join(", ");

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-3xl mx-auto bg-gray-900 border border-white/10 rounded-xl p-6">
                <h1 className="text-2xl md:text-3xl font-bold">{event.name}</h1>
                <p className="text-white/70 mt-2">
                    {event?.dates?.start?.localDate}
                    {event?.dates?.start?.localTime ? ` • ${event.dates.start.localTime}` : ""}
                </p>
                <p className="text-white/70 mt-1">{venueAddr}</p>

                {event?.info && <p className="mt-4">{event.info}</p>}
                {event?.pleaseNote && <p className="mt-3 text-amber-300/90">{event.pleaseNote}</p>}

                {event?.priceRanges?.length > 0 && (
                    <div className="mt-4">
                        <h3 className="font-semibold">Fiyat Aralığı</h3>
                        <ul className="text-white/80 text-sm mt-1">
                            {event.priceRanges.map((r, i) => (
                                <li key={i}>
                                    {r.type || "Genel"}: {r.min} – {r.max} {r.currency}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-5 flex gap-3">
                    {event.url && (
                        <a
                            href={event.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
                        >
                            Bilet/Etkinlik Sayfası
                        </a>
                    )}
                    <a
                        href="/"
                        className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 border border-white/10"
                    >
                        ← Listeye Dön
                    </a>
                </div>
            </div>
        </div>
    );
}
