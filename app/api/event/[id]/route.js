import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
    try {
        const { id } = params;
        const url = `${process.env.RAPIDAPI_BASE_URL.replace(/\/+$/,'')}/event/${id}`;

        const res = await fetch(url, {
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
            },
            cache: "no-store",
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        return NextResponse.json({ error: "Server error", details: String(e) }, { status: 500 });
    }
}
