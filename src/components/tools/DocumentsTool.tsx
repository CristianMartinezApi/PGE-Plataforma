import React, { useState } from 'react';
import { FileText, Upload, Search, Download, Folder, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  category: string;
  status: 'draft' | 'review' | 'approved';
}

interface DocumentsToolProps {
  onBack: () => void;
  onHome: () => void;
}

export function DocumentsTool({ onBack, onHome }: DocumentsToolProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Parecer Jurídico - Lei Estadual 123/2024',
      type: 'PDF',
      size: '2.3 MB',
      date: '15/01/2025',
      category: 'Pareceres',
      status: 'approved'
    },
    {
      id: '2',
      name: 'Minuta Contrato Administrativo',
      type: 'DOCX',
      size: '156 KB',
      date: '14/01/2025',
      category: 'Contratos',
      status: 'review'
    },
    {
      id: '3',
      name: 'Relatório Atividades 2024',
      type: 'PDF',
      size: '5.7 MB',
      date: '10/01/2025',
      category: 'Relatórios',
      status: 'draft'
    },
    {
      id: '4',
      name: 'Ata Reunião Procuradores - Janeiro',
      type: 'PDF',
      size: '890 KB',
      date: '08/01/2025',
      category: 'Atas',
      status: 'approved'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'review': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'draft': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'review': return 'Em Revisão';
      case 'draft': return 'Rascunho';
      default: return 'Indefinido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Ação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button 
          className="flex items-center space-x-2 bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white"
        >
          <Upload className="w-4 h-4" />
          <span>Fazer Upload</span>
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-[--pge-blue]" />
            <div className="text-2xl font-bold text-foreground">247</div>
            <div className="text-sm text-muted-foreground">Total de Documentos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Folder className="w-8 h-8 mx-auto mb-2 text-[--pge-blue]" />
            <div className="text-2xl font-bold text-foreground">8</div>
            <div className="text-sm text-muted-foreground">Categorias</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-[--pge-blue]" />
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-sm text-muted-foreground">Uploads Hoje</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Download className="w-8 h-8 mx-auto mb-2 text-[--pge-blue]" />
            <div className="text-2xl font-bold text-foreground">1.2 GB</div>
            <div className="text-sm text-muted-foreground">Espaço Usado</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Documentos */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="shared">Compartilhados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-3 flex-1">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-sm text-foreground">{doc.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                            {getStatusLabel(doc.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{doc.category}</span>
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2 text-foreground">Documentos Recentes</h3>
              <p className="text-muted-foreground">Os documentos acessados recentemente aparecerão aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2 text-foreground">Documentos Favoritos</h3>
              <p className="text-muted-foreground">Seus documentos favoritos aparecerão aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shared">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2 text-foreground">Documentos Compartilhados</h3>
              <p className="text-muted-foreground">Documentos compartilhados com você aparecerão aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}