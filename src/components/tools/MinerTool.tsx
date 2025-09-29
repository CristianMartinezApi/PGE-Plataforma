import React, { useState } from 'react';
import { Search, FileText, Download, Filter, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface MinerToolProps {
  onBack: () => void;
  onHome: () => void;
}

export function MinerTool({ onBack, onHome }: MinerToolProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const mockResults = [
    {
      id: '1',
      title: 'Processo nº 0123456-78.2024.8.24.0000',
      type: 'Ação Civil Pública',
      date: '15/01/2025',
      relevance: 95,
      summary: 'Processo relacionado a questões ambientais envolvendo licenciamento...'
    },
    {
      id: '2',
      title: 'Parecer Jurídico PGE/SC nº 456/2024',
      type: 'Parecer',
      date: '10/01/2025',
      relevance: 87,
      summary: 'Parecer sobre constitucionalidade de lei estadual...'
    },
    {
      id: '3',
      title: 'Acórdão TJ/SC - Apelação 789.456.123',
      type: 'Jurisprudência',
      date: '08/01/2025',
      relevance: 82,
      summary: 'Decisão sobre responsabilidade do Estado em casos de danos...'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Painel de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-[--pge-blue]" />
            <span>Mineração de Documentos</span>
          </CardTitle>
          <CardDescription>
            Busque e analise documentos jurídicos usando inteligência artificial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite sua consulta jurídica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={!searchQuery || isAnalyzing}
              className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white"
            >
              {isAnalyzing ? 'Analisando...' : 'Analisar'}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processando documentos...</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados em Abas */}
      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
          <TabsTrigger value="exports">Exportações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="results" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Documentos Encontrados</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {mockResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{result.title}</h4>
                    <Badge variant="secondary">{result.relevance}% relevante</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {result.type}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {result.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm">
                      Ver Documento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-[--pge-blue]" />
                <div className="text-2xl font-bold text-foreground">1,247</div>
                <div className="text-sm text-muted-foreground">Documentos Analisados</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-[--pge-blue]" />
                <div className="text-2xl font-bold text-foreground">89</div>
                <div className="text-sm text-muted-foreground">Resultados Relevantes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Search className="w-8 h-8 mx-auto mb-2 text-[--pge-blue]" />
                <div className="text-2xl font-bold text-foreground">96%</div>
                <div className="text-sm text-muted-foreground">Precisão da Busca</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportar Resultados</CardTitle>
              <CardDescription>
                Escolha o formato e os dados para exportação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <FileText className="w-6 h-6 mx-auto mb-1" />
                    <div>Relatório PDF</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-16">
                  <div className="text-center">
                    <Download className="w-6 h-6 mx-auto mb-1" />
                    <div>Planilha Excel</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}