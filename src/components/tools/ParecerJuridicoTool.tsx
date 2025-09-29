import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  FileText, 
  Calendar, 
  User, 
  Filter,
  Download,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Parecer {
  id: string;
  numero: string;
  titulo: string;
  requerente: string;
  procurador: string;
  status: 'em_elaboracao' | 'revisao' | 'finalizado' | 'arquivado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataCreacao: string;
  dataPrazo: string;
  categoria: string;
  resumo: string;
  conteudo?: string;
}

interface ParecerJuridicoToolProps {
  onBack: () => void;
  onHome: () => void;
}

const mockPareceres: Parecer[] = [
  {
    id: '1',
    numero: 'PAR-2024-001',
    titulo: 'Análise de Constitucionalidade - Lei Municipal nº 1234/2024',
    requerente: 'Secretaria de Administração',
    procurador: 'Dr. João Silva',
    status: 'em_elaboracao',
    prioridade: 'alta',
    dataCreacao: '2024-01-15',
    dataPrazo: '2024-02-15',
    categoria: 'Constitucional',
    resumo: 'Análise da constitucionalidade da lei municipal que dispõe sobre a reorganização administrativa.',
    conteudo: 'Análise detalhada da constitucionalidade...'
  },
  {
    id: '2',
    numero: 'PAR-2024-002',
    titulo: 'Parecer sobre Licitação - Pregão Eletrônico nº 50/2024',
    requerente: 'Secretaria de Obras',
    procurador: 'Dra. Maria Santos',
    status: 'finalizado',
    prioridade: 'media',
    dataCreacao: '2024-01-10',
    dataPrazo: '2024-01-25',
    categoria: 'Administrativo',
    resumo: 'Análise jurídica do processo licitatório para contratação de obras públicas.',
    conteudo: 'Parecer favorável ao processo licitatório...'
  },
  {
    id: '3',
    numero: 'PAR-2024-003',
    titulo: 'Manifestação em Ação Civil Pública',
    requerente: 'Ministério Público',
    procurador: 'Dr. Carlos Oliveira',
    status: 'revisao',
    prioridade: 'urgente',
    dataCreacao: '2024-01-20',
    dataPrazo: '2024-01-30',
    categoria: 'Cível',
    resumo: 'Manifestação do Estado em ação civil pública sobre danos ambientais.',
    conteudo: 'Defesa técnica apresentando argumentos...'
  }
];

const statusConfig = {
  em_elaboracao: { label: 'Em Elaboração', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  revisao: { label: 'Em Revisão', color: 'bg-blue-100 text-blue-800', icon: Eye },
  finalizado: { label: 'Finalizado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  arquivado: { label: 'Arquivado', color: 'bg-gray-100 text-gray-800', icon: XCircle }
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'bg-gray-100 text-gray-800' },
  media: { label: 'Média', color: 'bg-blue-100 text-blue-800' },
  alta: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  urgente: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
};

export function ParecerJuridicoTool({ onBack, onHome }: ParecerJuridicoToolProps) {
  const [pareceres] = useState<Parecer[]>(mockPareceres);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPrioridade, setSelectedPrioridade] = useState<string>('todas');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParecer, setSelectedParecer] = useState<Parecer | null>(null);
  const [viewMode, setViewMode] = useState<'lista' | 'detalhes' | 'edicao'>('lista');

  const categorias = ['Constitucional', 'Administrativo', 'Cível', 'Trabalhista', 'Tributário'];

  const filteredPareceres = useMemo(() => {
    return pareceres.filter(parecer => {
      const matchesSearch = 
        parecer.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parecer.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parecer.requerente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parecer.procurador.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'todos' || parecer.status === selectedStatus;
      const matchesPrioridade = selectedPrioridade === 'todas' || parecer.prioridade === selectedPrioridade;
      const matchesCategoria = selectedCategoria === 'todas' || parecer.categoria === selectedCategoria;

      return matchesSearch && matchesStatus && matchesPrioridade && matchesCategoria;
    });
  }, [pareceres, searchTerm, selectedStatus, selectedPrioridade, selectedCategoria]);

  const handleViewParecer = (parecer: Parecer) => {
    setSelectedParecer(parecer);
    setViewMode('detalhes');
  };

  const handleEditParecer = (parecer: Parecer) => {
    setSelectedParecer(parecer);
    setViewMode('edicao');
  };

  const handleNewParecer = () => {
    setSelectedParecer(null);
    setViewMode('edicao');
  };

  const handleBackToList = () => {
    setViewMode('lista');
    setSelectedParecer(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isPrazoVencido = (dataPrazo: string) => {
    return new Date(dataPrazo) < new Date();
  };

  if (viewMode === 'detalhes' && selectedParecer) {
    const StatusIcon = statusConfig[selectedParecer.status].icon;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToList}>
              Voltar
            </Button>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{selectedParecer.titulo}</h3>
              <p className="text-sm text-muted-foreground">{selectedParecer.numero}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => handleEditParecer(selectedParecer)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Parecer</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-muted-foreground mb-4">{selectedParecer.resumo}</p>
                <div className="whitespace-pre-wrap text-foreground">
                  {selectedParecer.conteudo || 'Conteúdo em elaboração...'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <StatusIcon className="w-5 h-5" />
                  <span>Informações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={`${statusConfig[selectedParecer.status].color} mt-1`}>
                    {statusConfig[selectedParecer.status].label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prioridade</Label>
                  <Badge className={`${prioridadeConfig[selectedParecer.prioridade].color} mt-1`}>
                    {prioridadeConfig[selectedParecer.prioridade].label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Categoria</Label>
                  <p className="text-foreground">{selectedParecer.categoria}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Requerente</Label>
                  <p className="text-foreground">{selectedParecer.requerente}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Procurador</Label>
                  <p className="text-foreground">{selectedParecer.procurador}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data de Criação</Label>
                  <p className="text-foreground">{formatDate(selectedParecer.dataCreacao)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prazo</Label>
                  <p className={`${isPrazoVencido(selectedParecer.dataPrazo) ? 'text-destructive' : 'text-foreground'}`}>
                    {formatDate(selectedParecer.dataPrazo)}
                    {isPrazoVencido(selectedParecer.dataPrazo) && ' (Vencido)'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'edicao') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToList}>
              Voltar
            </Button>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {selectedParecer ? 'Editar Parecer' : 'Novo Parecer'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedParecer ? selectedParecer.numero : 'Criar novo parecer jurídico'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Salvar Rascunho</Button>
            <Button className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
              {selectedParecer ? 'Atualizar' : 'Criar Parecer'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Parecer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título *</Label>
                    <Input 
                      id="titulo" 
                      defaultValue={selectedParecer?.titulo || ''} 
                      placeholder="Título do parecer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select defaultValue={selectedParecer?.categoria || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(categoria => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requerente">Requerente *</Label>
                    <Input 
                      id="requerente" 
                      defaultValue={selectedParecer?.requerente || ''} 
                      placeholder="Nome do requerente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataPrazo">Data Prazo *</Label>
                    <Input 
                      id="dataPrazo" 
                      type="date"
                      defaultValue={selectedParecer?.dataPrazo || ''} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumo">Resumo *</Label>
                  <Textarea 
                    id="resumo" 
                    defaultValue={selectedParecer?.resumo || ''} 
                    placeholder="Resumo do parecer jurídico"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conteudo">Conteúdo</Label>
                  <Textarea 
                    id="conteudo" 
                    defaultValue={selectedParecer?.conteudo || ''} 
                    placeholder="Conteúdo detalhado do parecer"
                    rows={12}
                    className="min-h-[300px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedParecer?.status || 'em_elaboracao'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select defaultValue={selectedParecer?.prioridade || 'media'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(prioridadeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="procurador">Procurador Responsável</Label>
                  <Select defaultValue={selectedParecer?.procurador || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o procurador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                      <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                      <SelectItem value="Dr. Carlos Oliveira">Dr. Carlos Oliveira</SelectItem>
                      <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com busca e filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pareceres Jurídicos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie pareceres jurídicos e manifestações da PGE
          </p>
        </div>
        <Button onClick={handleNewParecer} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Parecer
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Buscar pareceres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={selectedPrioridade} onValueChange={setSelectedPrioridade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Prioridades</SelectItem>
                  {Object.entries(prioridadeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Categorias</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('todos');
                  setSelectedPrioridade('todas');
                  setSelectedCategoria('todas');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pareceres */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parecer</TableHead>
                <TableHead>Requerente</TableHead>
                <TableHead>Procurador</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPareceres.map((parecer) => {
                const StatusIcon = statusConfig[parecer.status].icon;
                const isVencido = isPrazoVencido(parecer.dataPrazo);
                
                return (
                  <TableRow key={parecer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{parecer.titulo}</p>
                        <p className="text-sm text-muted-foreground">{parecer.numero}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{parecer.requerente}</TableCell>
                    <TableCell className="text-foreground">{parecer.procurador}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[parecer.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[parecer.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={prioridadeConfig[parecer.prioridade].color}>
                        {prioridadeConfig[parecer.prioridade].label}
                      </Badge>
                    </TableCell>
                    <TableCell className={isVencido ? 'text-destructive' : 'text-foreground'}>
                      {formatDate(parecer.dataPrazo)}
                      {isVencido && <span className="block text-xs">Vencido</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewParecer(parecer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditParecer(parecer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredPareceres.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum parecer encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedStatus !== 'todos' || selectedPrioridade !== 'todas' || selectedCategoria !== 'todas'
                  ? 'Tente ajustar os filtros para encontrar pareceres'
                  : 'Ainda não há pareceres cadastrados no sistema'
                }
              </p>
              <Button onClick={handleNewParecer} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Parecer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}