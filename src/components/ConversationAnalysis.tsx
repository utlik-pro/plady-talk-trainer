
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RotateCcw, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useConversationHistory } from '@/hooks/useConversationHistory';

interface ConversationAnalysisProps {
  messages: Array<{text?: string, message_text?: string, sender: 'user' | 'character'}>;
  character: {name: string, avatar: string, personality: string};
  sessionId: string | null;
  onStartNew: () => void;
}

interface AnalysisResult {
  overall_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  conversation_flow: string;
  recommendations: string[];
  detailed_feedback: string;
}

export const ConversationAnalysis = ({ messages, character, sessionId, onStartNew }: ConversationAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { saveAnalysis } = useConversationHistory();

  useEffect(() => {
    analyzeConversation();
  }, []);

  const analyzeConversation = async () => {
    setIsLoading(true);
    
    try {
      const conversationText = messages
        .map(msg => {
          const text = msg.text || msg.message_text || '';
          return `${msg.sender === 'user' ? 'Пользователь' : character.name}: ${text}`;
        })
        .join('\n');

      const prompt = `
Проанализируй этот разговор пользователя с виртуальным персонажем для тренировки навыков общения.

Персонаж: ${character.name} - ${character.personality}

Разговор:
${conversationText}

Дай подробный анализ в формате JSON со следующими полями:
- overall_score: общий балл от 1 до 10
- strengths: массив сильных сторон (на русском)
- areas_for_improvement: массив областей для улучшения (на русском)
- conversation_flow: оценка течения разговора (на русском)
- recommendations: массив рекомендаций (на русском)
- detailed_feedback: подробная обратная связь (на русском)

Отвечай только JSON без дополнительного текста.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Ты эксперт по анализу навыков общения. Анализируй разговоры конструктивно и давай полезные советы.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let analysisText = data.choices[0].message.content;
      
      // Убираем markdown разметку если она есть
      if (analysisText.includes('```json')) {
        analysisText = analysisText.replace(/```json\n?/g, '').replace(/```/g, '');
      }
      
      try {
        const parsedAnalysis = JSON.parse(analysisText.trim());
        setAnalysis(parsedAnalysis);
        
        // Сохраняем анализ в базу данных
        if (sessionId) {
          await saveAnalysis(sessionId, parsedAnalysis);
          console.log('Analysis saved to database for session:', sessionId);
        }
        
      } catch (parseError) {
        console.error('Failed to parse analysis JSON:', parseError);
        console.error('Raw response:', analysisText);
        throw new Error('Не удалось распарсить ответ от ChatGPT');
      }

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось проанализировать разговор",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-plady-light to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-plady-purple" />
          <p className="text-gray-600">Анализирую ваш разговор...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plady-light to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Анализ разговора</h1>
          <p className="text-gray-600">с {character.name} {character.avatar}</p>
        </div>

        {analysis && (
          <>
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Общий результат</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-plady-purple mb-2">
                    {analysis.overall_score}/10
                  </div>
                  <p className="text-gray-600">{analysis.conversation_flow}</p>
                </div>
              </CardContent>
            </Card>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Сильные стороны</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Области для улучшения</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.areas_for_improvement.map((area, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-orange-500 mt-1">!</span>
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Рекомендации</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-plady-purple mt-1">→</span>
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Detailed Feedback */}
            <Card>
              <CardHeader>
                <CardTitle>Подробная обратная связь</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {analysis.detailed_feedback}
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button onClick={onStartNew} className="bg-gradient-to-r from-plady-pink to-plady-purple">
            <RotateCcw className="w-4 h-4 mr-2" />
            Назад к истории
          </Button>
        </div>
      </div>
    </div>
  );
};
