import { NextRequest, NextResponse } from 'next/server';

const PINTEREST_API_URL = 'https://api.pinterest.com/v5/search/pins';

export async function POST(req: NextRequest) {
  try {
    const { query, filters } = await req.json();
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'Pinterest access token not configured.' }, { status: 500 });
    }

    // Monta a query de busca
    const searchParams = new URLSearchParams({
      query: query || 'fashion inspiration',
      page_size: '10',
    });
    // Adiciona filtros se existirem
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, value as string);
      });
    }

    const response = await fetch(`${PINTEREST_API_URL}?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    // Retorna os dados em JSON para integração
    return NextResponse.json({ results: data.items || [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
