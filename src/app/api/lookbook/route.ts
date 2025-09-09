import { NextRequest, NextResponse } from 'next/server';

interface SavedLook {
  id: string;
  descricao: string;
  imagens: string[];
  dicas: string[];
  acessorios: string[];
  profile: {
    clima?: string;
    ocasiao?: string;
    cores?: string;
    estilo?: string;
    conforto?: string;
    personalidade?: string;
  };
  createdAt: string;
  isFavorite: boolean;
}

// Simulação de banco de dados em memória (em produção, usar um banco real)
const lookbook: SavedLook[] = [];

// GET - Buscar todos os looks salvos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyFavorites = searchParams.get('favorites') === 'true';
    
    let filteredLooks = lookbook;
    if (onlyFavorites) {
      filteredLooks = lookbook.filter(look => look.isFavorite);
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    filteredLooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      looks: filteredLooks,
      total: filteredLooks.length
    });
  } catch (error) {
    console.error('Erro ao buscar lookbook:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Salvar um novo look
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { look, profile } = body;
    
    if (!look || !look.descricao) {
      return NextResponse.json(
        { success: false, error: 'Dados do look são obrigatórios' },
        { status: 400 }
      );
    }
    
    const newLook: SavedLook = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      descricao: look.descricao,
      imagens: look.imagens || [],
      dicas: look.dicas || [],
      acessorios: look.acessorios || [],
      profile: profile || {},
      createdAt: new Date().toISOString(),
      isFavorite: false
    };
    
    lookbook.push(newLook);
    
    console.log('💖 Look salvo no lookbook:', newLook.id);
    
    return NextResponse.json({
      success: true,
      message: 'Look salvo com sucesso no seu lookbook! 💕',
      look: newLook
    });
  } catch (error) {
    console.error('Erro ao salvar look:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um look (favoritar/desfavoritar)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, data } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do look é obrigatório' },
        { status: 400 }
      );
    }
    
    const lookIndex = lookbook.findIndex(look => look.id === id);
    if (lookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Look não encontrado' },
        { status: 404 }
      );
    }
    
    if (action === 'favorite') {
      lookbook[lookIndex].isFavorite = data.isFavorite;
      const message = data.isFavorite 
        ? 'Look adicionado aos favoritos! ⭐' 
        : 'Look removido dos favoritos';
      
      return NextResponse.json({
        success: true,
        message,
        look: lookbook[lookIndex]
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Ação não reconhecida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro ao atualizar look:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Remover um look
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do look é obrigatório' },
        { status: 400 }
      );
    }
    
    const lookIndex = lookbook.findIndex(look => look.id === id);
    if (lookIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Look não encontrado' },
        { status: 404 }
      );
    }
    
    lookbook.splice(lookIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Look removido do lookbook'
    });
  } catch (error) {
    console.error('Erro ao remover look:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}