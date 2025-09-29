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
  XCircle,
  AlertCircle,
  Send,
  BookOpen,
  Gavel
} from 'lucide-react';

interface AtoNormativo {
  id: string;
  numero: string;
  tipo: 'decreto' | 'portaria' | 'resolucao' | 'instrucao_normativa' | 'ato_conjunto';
  titulo: string;
  ementa: string;
  orgaoOrigem: string;
  responsavel: string;
  status: 'rascunho' | 'em_analise' | 'aguardando_aprovacao' | 'aprovado' | 'publicado' | 'revogado';
  dataCreacao: string;
  dataAprovacao?: string;
  dataPublicacao?: string;
  numeroPublicacao?: string;
  categoria: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  observacoes?: string;
  conteudo?: string;
}

interface AtosNormativosToolProps {
  onBack: () => void;
  onHome: () => void;
}

const mockAtos: AtoNormativo[] = [
  {
    id: '1',
    numero: 'DEC-2024-001',
    tipo: 'decreto',
    titulo: 'Decreto sobre Reorganização Administrativa',
    ementa: 'Dispõe sobre a reorganização da estrutura administrativa da PGE-SC',
    orgaoOrigem: 'Procuradoria-Geral do Estado',
    responsavel: 'Dr. João Silva',
    status: 'em_analise',
    dataCreacao: '2024-01-15',
    categoria: 'Administrativo',
    prioridade: 'alta',
    observacoes: 'Aguardando análise jurídica',
    conteudo: 'O PROCURADOR-GERAL DO ESTADO DE SANTA CATARINA...'
  },
  {
    id: '2',
    numero: 'PORT-2024-005',
    tipo: 'portaria',
    titulo: 'Portaria de Delegação de Competências',
    ementa: 'Delega competências específicas aos Procuradores Regionais',
    orgaoOrigem: 'Gabinete do Procurador-Geral',
    responsavel: 'Dra. Maria Santos',
    status: 'publicado',
    dataCreacao: '2024-01-10',
    dataAprovacao: '2024-01-20',
    dataPublicacao: '2024-01-22',
    numeroPublicacao: 'DOE nº 21.500',
    categoria: 'Administrativo',
    prioridade: 'media',
    conteudo: 'O PROCURADOR-GERAL DO ESTADO DE SANTA CATARINA...'
  },
  {
    id: '3',
    numero: 'RES-2024-002',
    tipo: 'resolucao',
    titulo: 'Resolução sobre Procedimentos Internos',
    ementa: 'Estabelece procedimentos para tramitação de processos internos',
    orgaoOrigem: 'Coordenadoria Administrativa',
    responsavel: 'Dr. Carlos Oliveira',
    status: 'aguardando_aprovacao',
    dataCreacao: '2024-01-18',
    categoria: 'Processual',
    prioridade: 'urgente',
    observacoes: 'Aguardando assinatura do Procurador-Geral',
    conteudo: 'O PROCURADOR-GERAL DO ESTADO DE SANTA CATARINA...'
  }
];

const statusConfig = {
  rascunho: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800', icon: FileText },
  em_analise: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800', icon: Eye },
  aguardando_aprovacao: { label: 'Aguardando Aprovação', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  publicado: { label: 'Publicado', color: 'bg-green-100 text-green-800', icon: BookOpen },
  revogado: { label: 'Revogado', color: 'bg-red-100 text-red-800', icon: XCircle }
};

const tipoConfig = {
  decreto: { label: 'Decreto', icon: Gavel },
  portaria: { label: 'Portaria', icon: FileText },
  resolucao: { label: 'Resolução', icon: BookOpen },
  instrucao_normativa: { label: 'Instrução Normativa', icon: FileText },
  ato_conjunto: { label: 'Ato Conjunto', icon: FileText }
};

const prioridadeConfig = {
  baixa: { label: 'Baixa', color: 'bg-gray-100 text-gray-800' },
  media: { label: 'Média', color: 'bg-blue-100 text-blue-800' },
  alta: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  urgente: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
};

export function AtosNormativosTool({ onBack, onHome }: AtosNormativosToolProps) {
  const [atos] = useState<AtoNormativo[]>(mockAtos);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('todas');
  const [selectedAto, setSelectedAto] = useState<AtoNormativo | null>(null);
  const [viewMode, setViewMode] = useState<'lista' | 'detalhes' | 'edicao'>('lista');

  const categorias = ['Administrativo', 'Processual', 'Pessoal', 'Financeiro', 'Jurídico'];

  const filteredAtos = useMemo(() => {
    return atos.filter(ato => {
      const matchesSearch = 
        ato.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ato.ementa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ato.orgaoOrigem.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'todos' || ato.status === selectedStatus;
      const matchesTipo = selectedTipo === 'todos' || ato.tipo === selectedTipo;
      const matchesCategoria = selectedCategoria === 'todas' || ato.categoria === selectedCategoria;

      return matchesSearch && matchesStatus && matchesTipo && matchesCategoria;
    });
  }, [atos, searchTerm, selectedStatus, selectedTipo, selectedCategoria]);

  const handleViewAto = (ato: AtoNormativo) => {
    setSelectedAto(ato);
    setViewMode('detalhes');
  };

  const handleEditAto = (ato: AtoNormativo) => {
    setSelectedAto(ato);
    setViewMode('edicao');
  };

  const handleNewAto = () => {
    setSelectedAto(null);
    setViewMode('edicao');
  };

  const handleBackToList = () => {
    setViewMode('lista');
    setSelectedAto(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      rascunho: 'em_analise',
      em_analise: 'aguardando_aprovacao',
      aguardando_aprovacao: 'aprovado',
      aprovado: 'publicado'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getNextStatusLabel = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? statusConfig[nextStatus as keyof typeof statusConfig]?.label : null;
  };

  if (viewMode === 'detalhes' && selectedAto) {
    const StatusIcon = statusConfig[selectedAto.status].icon;
    const TipoIcon = tipoConfig[selectedAto.tipo].icon;
    const nextStatusLabel = getNextStatusLabel(selectedAto.status);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToList}>
              Voltar
            </Button>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{selectedAto.titulo}</h3>
              <p className="text-sm text-muted-foreground">{selectedAto.numero}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => handleEditAto(selectedAto)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            {nextStatusLabel && (
              <Button className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                <Send className="w-4 h-4 mr-2" />
                Enviar para {nextStatusLabel}
              </Button>
            )}
            {selectedAto.status === 'publicado' && (
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Ato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Ementa</Label>
                    <p className="text-foreground mt-1">{selectedAto.ementa}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="text-muted-foreground">Texto do Ato</Label>
                    <div className="mt-2 whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-lg">
                      {selectedAto.conteudo || 'Conteúdo em elaboração...'}
                    </div>
                  </div>
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
                  <Label className="text-muted-foreground">Tipo</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <TipoIcon className="w-4 h-4 text-[--pge-blue]" />
                    <span className="text-foreground">{tipoConfig[selectedAto.tipo].label}</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={`${statusConfig[selectedAto.status].color} mt-1`}>
                    {statusConfig[selectedAto.status].label}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Prioridade</Label>
                  <Badge className={`${prioridadeConfig[selectedAto.prioridade].color} mt-1`}>
                    {prioridadeConfig[selectedAto.prioridade].label}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Categoria</Label>
                  <p className="text-foreground">{selectedAto.categoria}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Órgão de Origem</Label>
                  <p className="text-foreground">{selectedAto.orgaoOrigem}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Responsável</Label>
                  <p className="text-foreground">{selectedAto.responsavel}</p>
                </div>
                
                <div>
                  <Label className="text-muted-foreground">Data de Criação</Label>
                  <p className="text-foreground">{formatDate(selectedAto.dataCreacao)}</p>
                </div>
                
                {selectedAto.dataAprovacao && (
                  <div>
                    <Label className="text-muted-foreground">Data de Aprovação</Label>
                    <p className="text-foreground">{formatDate(selectedAto.dataAprovacao)}</p>
                  </div>
                )}
                
                {selectedAto.dataPublicacao && (
                  <div>
                    <Label className="text-muted-foreground">Data de Publicação</Label>
                    <p className="text-foreground">{formatDate(selectedAto.dataPublicacao)}</p>
                  </div>
                )}
                
                {selectedAto.numeroPublicacao && (
                  <div>
                    <Label className="text-muted-foreground">Publicação</Label>
                    <p className="text-foreground">{selectedAto.numeroPublicacao}</p>
                  </div>
                )}
                
                {selectedAto.observacoes && (
                  <div>
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="text-foreground">{selectedAto.observacoes}</p>
                  </div>
                )}
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
                {selectedAto ? 'Editar Ato Normativo' : 'Novo Ato Normativo'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedAto ? selectedAto.numero : 'Criar novo ato normativo'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Salvar Rascunho</Button>
            <Button className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
              {selectedAto ? 'Atualizar' : 'Criar Ato'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Ato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Ato *</Label>
                    <Select defaultValue={selectedAto?.tipo || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(tipoConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select defaultValue={selectedAto?.categoria || ''}>
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

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input 
                    id="titulo" 
                    defaultValue={selectedAto?.titulo || ''} 
                    placeholder="Título do ato normativo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ementa">Ementa *</Label>
                  <Textarea 
                    id="ementa" 
                    defaultValue={selectedAto?.ementa || ''} 
                    placeholder="Ementa do ato normativo"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgaoOrigem">Órgão de Origem *</Label>
                    <Select defaultValue={selectedAto?.orgaoOrigem || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o órgão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Procuradoria-Geral do Estado">Procuradoria-Geral do Estado</SelectItem>
                        <SelectItem value="Gabinete do Procurador-Geral">Gabinete do Procurador-Geral</SelectItem>
                        <SelectItem value="Coordenadoria Administrativa">Coordenadoria Administrativa</SelectItem>
                        <SelectItem value="Coordenadoria Jurídica">Coordenadoria Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Select defaultValue={selectedAto?.responsavel || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. João Silva">Dr. João Silva</SelectItem>
                        <SelectItem value="Dra. Maria Santos">Dra. Maria Santos</SelectItem>
                        <SelectItem value="Dr. Carlos Oliveira">Dr. Carlos Oliveira</SelectItem>
                        <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea 
                    id="observacoes" 
                    defaultValue={selectedAto?.observacoes || ''} 
                    placeholder="Observações sobre o ato"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conteudo">Conteúdo do Ato</Label>
                  <Textarea 
                    id="conteudo" 
                    defaultValue={selectedAto?.conteudo || ''} 
                    placeholder="Texto completo do ato normativo"
                    rows={15}
                    className="min-h-[400px] font-mono text-sm"
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
                  <Select defaultValue={selectedAto?.status || 'rascunho'}>
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
                  <Select defaultValue={selectedAto?.prioridade || 'media'}>
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

                {selectedAto?.status === 'publicado' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dataPublicacao">Data de Publicação</Label>
                      <Input 
                        id="dataPublicacao" 
                        type="date"
                        defaultValue={selectedAto?.dataPublicacao || ''} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="numeroPublicacao">Número da Publicação</Label>
                      <Input 
                        id="numeroPublicacao" 
                        defaultValue={selectedAto?.numeroPublicacao || ''} 
                        placeholder="Ex: DOE nº 21.500"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Atos Normativos</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie decretos, portarias, resoluções e demais atos normativos
          </p>
        </div>
        <Button onClick={handleNewAto} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ato
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
                  placeholder="Buscar atos..."
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
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  {Object.entries(tipoConfig).map(([key, config]) => (
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
                  setSelectedTipo('todos');
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

      {/* Lista de Atos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Órgão</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAtos.map((ato) => {
                const StatusIcon = statusConfig[ato.status].icon;
                const TipoIcon = tipoConfig[ato.tipo].icon;
                
                return (
                  <TableRow key={ato.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{ato.titulo}</p>
                        <p className="text-sm text-muted-foreground">{ato.numero}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TipoIcon className="w-4 h-4 text-[--pge-blue]" />
                        <span className="text-foreground">{tipoConfig[ato.tipo].label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{ato.orgaoOrigem}</TableCell>
                    <TableCell className="text-foreground">{ato.responsavel}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[ato.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[ato.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {formatDate(ato.dataCreacao)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAto(ato)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAto(ato)}
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

          {filteredAtos.length === 0 && (
            <div className="text-center py-12">
              <Gavel className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum ato encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedStatus !== 'todos' || selectedTipo !== 'todos' || selectedCategoria !== 'todas'
                  ? 'Tente ajustar os filtros para encontrar atos'
                  : 'Ainda não há atos normativos cadastrados no sistema'
                }
              </p>
              <Button onClick={handleNewAto} className="bg-[--pge-blue] hover:bg-[--pge-blue]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Ato
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}