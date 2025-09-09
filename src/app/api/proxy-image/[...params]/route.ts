import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { params: string[] } }) {
  try {
    // Extrair o ID da imagem e parâmetros da URL
    const [imageId, ...queryParams] = params.params;
    
    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    // Construir URL da Unsplash
    const unsplashUrl = `https://images.unsplash.com/${imageId}`;
    
    // Adicionar parâmetros de query se existirem
    const searchParams = new URL(request.url).searchParams;
    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${unsplashUrl}?${queryString}` : unsplashUrl;

    // Fazer fetch da imagem
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Lookia Fashion Assistant (https://lookia.app)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Retornar a imagem com headers apropriados
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy image error:', error);
    
    // Retornar uma imagem placeholder em caso de erro
    const placeholderUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center';
    
    try {
      const fallbackResponse = await fetch(placeholderUrl);
      const fallbackBuffer = await fallbackResponse.arrayBuffer();
      
      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to load image' },
        { status: 500 }
      );
    }
  }
}