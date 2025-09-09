import { NextRequest, NextResponse } from 'next/server';

interface FeedbackData {
  id: string;
  lookId?: string;
  userProfile: {
    clima?: string;
    ocasiao?: string;
    cores?: string;
    estilo?: string;
    conforto?: string;
    personalidade?: string;
  };
  recommendation: {
    descricao: string;
    imagens: string[];
    dicas: string[];
    acessorios: string[];
  };
  feedback: 'like' | 'dislike';
  reason?: string;
  suggestions?: string;
  createdAt: string;
}

// Simulação de banco de dados em memória (em produção, usar um banco real)
const feedbackDatabase: FeedbackData[] = [];

// GET - Buscar estatísticas de feedback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (type === 'stats') {
      const totalFeedbacks = feedbackDatabase.length;
      const likes = feedbackDatabase.filter(f => f.feedback === 'like').length;
      const dislikes = feedbackDatabase.filter(f => f.feedback === 'dislike').length;
      const likePercentage = totalFeedbacks > 0 ? Math.round((likes / totalFeedbacks) * 100) : 0;
      
      // Análise por categoria
      const feedbackByCategory = {
        ocasiao: {},
        estilo: {},
        clima: {},
        personalidade: {}
      };
      
      feedbackDatabase.forEach(feedback => {
        const profile = feedback.userProfile;
        
        // Contar feedback por ocasião
        if (profile.ocasiao) {
          if (!feedbackByCategory.ocasiao[profile.ocasiao as keyof typeof feedbackByCategory.ocasiao]) {
            (feedbackByCategory.ocasiao as Record<string, { likes: number, dislikes: number }>)[profile.ocasiao] = { likes: 0, dislikes: 0 };
          }
          ((feedbackByCategory.ocasiao as Record<string, { likes: number, dislikes: number }>)[profile.ocasiao])[feedback.feedback === 'like' ? 'likes' : 'dislikes']++;
        }
        
        // Contar feedback por estilo
        if (profile.estilo) {
          if (!((feedbackByCategory.estilo as Record<string, { likes: number, dislikes: number }>)[profile.estilo])) {
(feedbackByCategory.estilo as Record<string, { likes: number, dislikes: number }>)[profile.estilo] = { likes: 0, dislikes: 0 };
          }
((feedbackByCategory.estilo as Record<string, { likes: number, dislikes: number }>)[profile.estilo])[feedback.feedback === 'like' ? 'likes' : 'dislikes']++;
        }
        
        // Contar feedback por clima
        if (profile.clima) {
          if (!((feedbackByCategory.clima as Record<string, { likes: number, dislikes: number }>)[profile.clima])) {
(feedbackByCategory.clima as Record<string, { likes: number, dislikes: number }>)[profile.clima] = { likes: 0, dislikes: 0 };
          }
((feedbackByCategory.clima as Record<string, { likes: number, dislikes: number }>)[profile.clima])[feedback.feedback === 'like' ? 'likes' : 'dislikes']++;
        }
        
        // Contar feedback por personalidade
        if (profile.personalidade) {
          if (!((feedbackByCategory.personalidade as Record<string, { likes: number, dislikes: number }>)[profile.personalidade])) {
(feedbackByCategory.personalidade as Record<string, { likes: number, dislikes: number }>)[profile.personalidade] = { likes: 0, dislikes: 0 };
          }
((feedbackByCategory.personalidade as Record<string, { likes: number, dislikes: number }>)[profile.personalidade])[feedback.feedback === 'like' ? 'likes' : 'dislikes']++;
        }
      });
      
      return NextResponse.json({
        success: true,
        stats: {
          total: totalFeedbacks,
          likes,
          dislikes,
          likePercentage,
          feedbackByCategory
        }
      });
    }
    
    // Buscar todos os feedbacks
    const recentFeedbacks = feedbackDatabase
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50); // Últimos 50 feedbacks
    
    return NextResponse.json({
      success: true,
      feedbacks: recentFeedbacks
    });
  } catch (error) {
    console.error('Erro ao buscar feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Enviar feedback sobre um look
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, recommendation, feedback, reason, suggestions, lookId } = body;
    
    if (!userProfile || !recommendation || !feedback) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios: userProfile, recommendation, feedback' },
        { status: 400 }
      );
    }
    
    if (!['like', 'dislike'].includes(feedback)) {
      return NextResponse.json(
        { success: false, error: 'Feedback deve ser "like" ou "dislike"' },
        { status: 400 }
      );
    }
    
    const newFeedback: FeedbackData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      lookId,
      userProfile,
      recommendation,
      feedback,
      reason,
      suggestions,
      createdAt: new Date().toISOString()
    };
    
    feedbackDatabase.push(newFeedback);
    
    console.log(`📊 Feedback recebido: ${feedback} (${feedbackDatabase.length} total)`);
    
    // Mensagem personalizada baseada no feedback
    let message = '';
    if (feedback === 'like') {
      message = '💖 Obrigada pelo feedback positivo! Isso me ajuda a criar looks ainda melhores para você!';
    } else {
      message = '💭 Obrigada pelo feedback! Vou usar essas informações para melhorar minhas sugestões futuras.';
    }
    
    return NextResponse.json({
      success: true,
      message,
      feedbackId: newFeedback.id
    });
  } catch (error) {
    console.error('Erro ao salvar feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar feedback existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, feedback, reason, suggestions } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do feedback é obrigatório' },
        { status: 400 }
      );
    }
    
    const feedbackIndex = feedbackDatabase.findIndex(f => f.id === id);
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Feedback não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar campos fornecidos
    if (feedback && ['like', 'dislike'].includes(feedback)) {
      feedbackDatabase[feedbackIndex].feedback = feedback;
    }
    if (reason !== undefined) {
      feedbackDatabase[feedbackIndex].reason = reason;
    }
    if (suggestions !== undefined) {
      feedbackDatabase[feedbackIndex].suggestions = suggestions;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Feedback atualizado com sucesso!',
      feedback: feedbackDatabase[feedbackIndex]
    });
  } catch (error) {
    console.error('Erro ao atualizar feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Remover feedback
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do feedback é obrigatório' },
        { status: 400 }
      );
    }
    
    const feedbackIndex = feedbackDatabase.findIndex(f => f.id === id);
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Feedback não encontrado' },
        { status: 404 }
      );
    }
    
    feedbackDatabase.splice(feedbackIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Feedback removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}