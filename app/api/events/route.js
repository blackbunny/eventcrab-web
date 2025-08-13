import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const artist = searchParams.get("artist") || "";
        const city = searchParams.get("city") || "";
        const startDate = searchParams.get("startDate") || "";
        const endDate = searchParams.get("endDate") || "";
        const page = searchParams.get("page") || "0";

        const qs = new URLSearchParams();
        if (artist) qs.set("artist", artist);
        if (city) qs.set("city", city);
        if (startDate) qs.set("startDate", startDate);
        if (endDate) qs.set("endDate", endDate);
        if (page) qs.set("page", page);

        const url = `${process.env.RAPIDAPI_BASE_URL.replace(/\/+$/,'')}/events?${qs.toString()}`;

        const res = await fetch(url, {
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
            },
            // RapidAPI ürününde istersen method/timeout vs ekleyebilirsin
            cache: "no-store",
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.log(String(e));
        return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
    }
}
