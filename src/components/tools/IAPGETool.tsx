import React, { useState } from 'react';
import { Brain, Send, MessageSquare, BookOpen, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface IAPGEToolProps {
  onBack: () => void;
  onHome: () => void;
}

export function IAPGETool({ onBack, onHome }: IAPGEToolProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Olá! Sou o assistente de IA da PGE-SC. Como posso ajudá-lo com questões jurídicas hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular resposta da IA
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Com base na sua consulta sobre "${inputMessage}", posso fornecer algumas informações relevantes sobre jurisprudência e legislação aplicável. Gostaria que eu detalhe algum aspecto específico?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const suggestionQuestions = [
    "Qual a legislação sobre licitações públicas?",
    "Como funciona o processo administrativo disciplinar?",
    "Quais são os prazos prescricionais em direito administrativo?",
    "Como calcular correção monetária em precatórios?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Principal */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-[--pge-blue]" />
              <span>Assistente IA PGE</span>
              <Badge variant="secondary" className="ml-auto">Online</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Área de Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-[--pge-blue] text-white'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input de Mensagem */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite sua pergunta jurídica..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel Lateral */}
      <div className="space-y-4">
        {/* Sugestões Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Zap className="w-4 h-4 mr-2 text-[--pge-blue]" />
              Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {suggestionQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-2 text-xs"
                  onClick={() => setInputMessage(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-[--pge-blue]" />
              Sessão Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mensagens:</span>
              <span className="font-medium text-foreground">{messages.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tempo ativo:</span>
              <span className="font-medium text-foreground">12 min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Precisão:</span>
              <span className="font-medium text-foreground">94%</span>
            </div>
          </CardContent>
        </Card>

        {/* Recursos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-[--pge-blue]" />
              Recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Clock className="w-3 h-3 mr-2" />
                Histórico de Conversas
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <BookOpen className="w-3 h-3 mr-2" />
                Base de Conhecimento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}