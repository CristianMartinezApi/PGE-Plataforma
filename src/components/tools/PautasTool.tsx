import React, { useState, useMemo } from 'react';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  RefreshCw, 
  Clock, 
  User, 
  FileText, 
  Eye, 
  Edit3,
  Info
} from 'lucide-react';

interface Pauta {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: 'concluida' | 'andamento' | 'atrasada';
  data: Date;
  horario: string;
  categoria: string;
  prioridade: 'alta' | 'media' | 'baixa';
  link?: string;
}

interface PautasToolProps {
  onBack: () => void;
  onHome: () => void;
}

// Mock data - simula pautas coletadas automaticamente
const mockPautas: Pauta[] = [
  {
    id: '8',
    numero: 'PAU-2025-008',
    titulo: 'Processo nº 5054652-62.2025.8.24.0000',
    descricao: `Data de autuação: 14/07/2025 18:15:38
Situação: MOVIMENTO

Órgão Julgador: Gab. 01 - 3ª Câmara de Direito Público
Colegiado: 3ª Câmara de Direito Público
Relator(a): JAIME RAMOS
Classe da ação: Agravo de Instrumento

Processo Originário: 0905220-96.2014.8.24.0008/SC`,
    responsavel: 'Des. JAIME RAMOS',
    status: 'andamento',
    data: new Date(2025, 8, 30), // 30 de setembro de 2025
    horario: '15:30',
    categoria: 'Agravo de Instrumento',
    prioridade: 'alta',
    link: 'https://eproc2g.tjsc.jus.br/eproc/externo_controlador.php?acao=processo_seleciona_publica&num_processo=50546526220258240000'
  },
  {
    id: '7',
    numero: 'PAU-2025-007',
    titulo: 'Processo nº 5042772-10.2024.8.24.0000',
    descricao: `Data de autuação: 17/07/2024 10:25:10
Situação: MOVIMENTO

Órgão Julgador: Gab. 01 - 3ª Câmara de Direito Público
Colegiado: 3ª Câmara de Direito Público
Relator(a): JAIME RAMOS
Classe da ação: Agravo de Instrumento

Processo Originário: 0303619-83.2019.8.24.0023/SC`,
    responsavel: 'Des. JAIME RAMOS',
    status: 'andamento',
    data: new Date(2025, 8, 30), // 30 de setembro de 2025
    horario: '14:00',
    categoria: 'Agravo de Instrumento',
    prioridade: 'alta',
    link: 'https://eproc2g.tjsc.jus.br/eproc/externo_controlador.php?acao=processo_seleciona_publica&num_processo=50427721020248240000'
  },
  {
    id: '1',
    numero: 'PAU-2025-001',
    titulo: 'Análise de Recurso Administrativo',
    descricao: 'Análise do recurso administrativo protocolado pelo contribuinte João Silva contra autuação fiscal.',
    responsavel: 'Dr. Carlos Santos',
    status: 'andamento',
    data: new Date(2025, 0, 15), // 15 de janeiro de 2025
    horario: '09:00',
    categoria: 'Recurso Administrativo',
    prioridade: 'alta'
  },
  {
    id: '2',
    numero: 'PAU-2025-002',
    titulo: 'Parecer sobre Licitação',
    descricao: 'Elaboração de parecer jurídico sobre processo licitatório do Departamento de Obras.',
    responsavel: 'Dra. Maria Oliveira',
    status: 'concluida',
    data: new Date(2025, 0, 15),
    horario: '14:00',
    categoria: 'Licitação',
    prioridade: 'media'
  },
  {
    id: '3',
    numero: 'PAU-2025-003',
    titulo: 'Revisão de Contrato',
    descricao: 'Revisão dos termos contratuais do contrato de fornecimento de material de escritório.',
    responsavel: 'Dr. Pedro Costa',
    status: 'atrasada',
    data: new Date(2025, 0, 14), // 14 de janeiro de 2025
    horario: '10:30',
    categoria: 'Contratos',
    prioridade: 'baixa'
  },
  {
    id: '4',
    numero: 'PAU-2025-004',
    titulo: 'Audiência Pública',
    descricao: 'Participação em audiência pública sobre regulamentação ambiental.',
    responsavel: 'Dra. Ana Lima',
    status: 'andamento',
    data: new Date(2025, 0, 16), // 16 de janeiro de 2025
    horario: '15:00',
    categoria: 'Audiência',
    prioridade: 'alta'
  },
  {
    id: '5',
    numero: 'PAU-2025-005',
    titulo: 'Análise de Convênio',
    descricao: 'Análise jurídica de proposta de convênio com município de Florianópolis.',
    responsavel: 'Dr. João Ferreira',
    status: 'concluida',
    data: new Date(2025, 0, 16),
    horario: '11:00',
    categoria: 'Convênio',
    prioridade: 'media'
  },
  {
    id: '6',
    numero: 'PAU-2025-006',
    titulo: 'Defesa em Processo Judicial',
    descricao: 'Elaboração de defesa em ação civil pública movida contra o Estado.',
    responsavel: 'Dr. Carlos Santos',
    status: 'atrasada',
    data: new Date(2025, 0, 13), // 13 de janeiro de 2025
    horario: '08:00',
    categoria: 'Processo Judicial',
    prioridade: 'alta'
  }
];

const statusConfig = {
  concluida: { label: 'Concluída', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  andamento: { label: 'Em Andamento', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  atrasada: { label: 'Atrasada', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
};

const prioridadeConfig = {
  alta: { label: 'Alta', color: 'destructive' },
  media: { label: 'Média', color: 'secondary' },
  baixa: { label: 'Baixa', color: 'outline' }
};

export function PautasTool({ onBack, onHome }: PautasToolProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [responsavelFilter, setResponsavelFilter] = useState<string>('all');
  const [selectedPauta, setSelectedPauta] = useState<Pauta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Filtrar pautas
  const filteredPautas = useMemo(() => {
    return mockPautas.filter(pauta => {
      const matchesSearch = !searchTerm || 
        pauta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pauta.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pauta.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || pauta.status === statusFilter;
      const matchesResponsavel = responsavelFilter === 'all' || pauta.responsavel === responsavelFilter;
      
      return matchesSearch && matchesStatus && matchesResponsavel;
    });
  }, [searchTerm, statusFilter, responsavelFilter]);

  // Pautas do dia selecionado
  const pautasDodia = useMemo(() => {
    return filteredPautas.filter((pauta: Pauta) => {
      const pautaDate = new Date(pauta.data);
      const selectedDateTime = new Date(selectedDate);
      return pautaDate.toDateString() === selectedDateTime.toDateString();
      
    });
  }, [filteredPautas, selectedDate]);

  // Obter dias com pautas para destacar no calendário
  const diasComPautas = useMemo(() => {
    const dias = new Set<string>();
    filteredPautas.forEach((pauta: Pauta) => {
      dias.add(pauta.data.toDateString());
    });
    return dias;
  }, [filteredPautas]);

  // Responsáveis únicos para filtro
  const responsaveis = useMemo(() => {
    const uniqueResponsaveis = [...new Set(mockPautas.map(p => p.responsavel))];
    return uniqueResponsaveis.sort();
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // Aqui seria feita a chamada real para o robô atualizar as pautas
  };

  const handlePautaClick = (pauta: Pauta) => {
    setSelectedPauta(pauta);
    setDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros e atualização */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Última atualização: {formatDateTime(lastUpdate)}</span>
              <span className="sm:hidden">Atualizado: {formatDateTime(lastUpdate)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="hover:bg-[--pge-blue] hover:text-white w-fit"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Legenda:</span>
          <Badge variant="outline" className="text-green-700 border-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Concluída
          </Badge>
          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            Em Andamento
          </Badge>
          <Badge variant="outline" className="text-red-700 border-red-300">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Atrasada
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, número ou responsável..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="andamento">Em Andamento</SelectItem>
                  <SelectItem value="atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Responsável</label>
              <Select value={responsavelFilter} onValueChange={setResponsavelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os responsáveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os responsáveis</SelectItem>
                  {responsaveis.map((responsavel: string) => (
                    <SelectItem key={responsavel} value={responsavel}>
                      {responsavel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setResponsavelFilter('all');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>

          {(searchTerm || statusFilter !== 'all' || responsavelFilter !== 'all') && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {filteredPautas.length} pauta(s) encontrada(s) • {pautasDodia.length} no dia selecionado
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Layout principal: Calendário + Lista */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-1 order-2 lg:order-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Calendário de Pautas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date: Date | undefined) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasPauta: (date: Date) => diasComPautas.has(date.toDateString())
              }}
              modifiersStyles={{
                hasPauta: { 
                  backgroundColor: 'var(--pge-blue)', 
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Dias em azul possuem pautas agendadas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lista de pautas do dia */}
        <Card className="lg:col-span-2 order-1 lg:order-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Pautas de {formatDate(selectedDate)}</span>
              </div>
              <Badge variant="secondary">
                {pautasDodia.length} pauta(s)
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] lg:h-[500px]">
              {pautasDodia.length > 0 ? (
                <div className="space-y-4">
                  {pautasDodia.map((pauta) => (
                    <div
                      key={pauta.id}
                      className={`p-4 rounded-lg border border-border hover:shadow-md transition-all cursor-pointer bg-card hover:bg-accent/50`}
                      onClick={() => handlePautaClick(pauta)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-border">
                              {pauta.numero}
                            </Badge>
                            <Badge variant={prioridadeConfig[pauta.prioridade].color as any} className="text-xs">
                              {prioridadeConfig[pauta.prioridade].label}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {pauta.horario}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`${statusConfig[pauta.status].textColor} border-current text-xs sm:hidden`}
                            >
                              <div className={`w-2 h-2 ${statusConfig[pauta.status].color} rounded-full mr-1`}></div>
                              {statusConfig[pauta.status].label}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-foreground mb-2">{pauta.titulo}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span className="truncate">{pauta.responsavel}</span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-xs font-normal">
                                {pauta.categoria}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${statusConfig[pauta.status].textColor} border-current hidden sm:flex`}
                          >
                            <div className={`w-2 h-2 ${statusConfig[pauta.status].color} rounded-full mr-2`}></div>
                            {statusConfig[pauta.status].label}
                          </Badge>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">
                    Nenhuma pauta encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Não há pautas agendadas para {formatDate(selectedDate)}
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Modal de detalhes da pauta */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPauta && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Detalhes da Pauta</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Cabeçalho do processo */}
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-base px-3 py-1.5 text-foreground border-border">{selectedPauta.numero}</Badge>
                    <Badge 
                      variant="outline" 
                      className={`${statusConfig[selectedPauta.status].textColor} border-current px-3 py-1.5`}
                    >
                      <div className={`w-2 h-2 ${statusConfig[selectedPauta.status].color} rounded-full mr-2`}></div>
                      {statusConfig[selectedPauta.status].label}
                    </Badge>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h2 className="text-xl font-semibold text-foreground tracking-tight">{selectedPauta.titulo}</h2>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="py-1.5 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-foreground/70" />
                        {formatDate(selectedPauta.data)} às {selectedPauta.horario}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Informações da capa do processo */}
                <Card className="p-6 border-border">
                  <div className="space-y-6">
                    {/* Informações principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm text-muted-foreground font-medium">Data de Autuação</label>
                        <p className="text-foreground">
                          {selectedPauta.descricao.match(/Data de autuação: (.*)/)?.[1] || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-muted-foreground font-medium">Situação</label>
                        <p className="text-foreground">
                          {selectedPauta.descricao.match(/Situação: (.*)/)?.[1] || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    {/* Informações do órgão julgador */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm text-muted-foreground font-medium">Órgão Julgador</label>
                        <p className="text-foreground">
                          {selectedPauta.descricao.match(/Órgão Julgador: (.*)/)?.[1] || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-muted-foreground font-medium">Colegiado</label>
                        <p className="text-foreground">
                          {selectedPauta.descricao.match(/Colegiado: (.*)/)?.[1] || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-muted-foreground font-medium">Relator(a)</label>
                        <p className="text-foreground">
                          {selectedPauta.descricao.match(/Relator\(a\): (.*)/)?.[1] || 'Não informado'}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm text-muted-foreground font-medium">Classe da Ação</label>
                        <p className="text-foreground">
                          {selectedPauta.descricao.match(/Classe da ação: (.*)/)?.[1] || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    {/* Processo originário */}
                    <div className="space-y-1.5">
                      <label className="text-sm text-muted-foreground font-medium">Processo Originário</label>
                      <p className="text-foreground">
                        {selectedPauta.descricao.match(/Originário: (.*)/)?.[1] || 'Não informado'}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Ações */}
                <div className="flex flex-col space-y-3 pt-4">
                  {selectedPauta.link && (
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium shadow-md transition-colors"
                      onClick={() => window.open(selectedPauta.link, '_blank')}
                    >
                      <FileText className="w-5 h-5 mr-3" />
                      Visualizar Processo Completo
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}