import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  UserCheck, 
  Users, 
  DollarSign, 
  Timer,
  Building2,
  Menu,
  X,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  companyName: string;
}

export default function Dashboard({ companyName }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data for charts
  const weeklyData = [
    { day: 'Seg', agendamentos: 45 },
    { day: 'Ter', agendamentos: 52 },
    { day: 'Qua', agendamentos: 38 },
    { day: 'Qui', agendamentos: 61 },
    { day: 'Sex', agendamentos: 55 },
    { day: 'Sáb', agendamentos: 28 },
    { day: 'Dom', agendamentos: 15 }
  ];

  const timeData = [
    { month: 'Jan', antes: 240, depois: 120 },
    { month: 'Fev', antes: 230, depois: 115 },
    { month: 'Mar', antes: 250, depois: 125 },
    { month: 'Abr', antes: 245, depois: 110 },
    { month: 'Mai', antes: 235, depois: 105 },
    { month: 'Jun', antes: 255, depois: 100 }
  ];

  const financialData = [
    { month: 'Jan', economia: 12000 },
    { month: 'Fev', economia: 15000 },
    { month: 'Mar', economia: 18000 },
    { month: 'Abr', economia: 22000 },
    { month: 'Mai', economia: 25000 },
    { month: 'Jun', economia: 28000 }
  ];

  const typeData = [
    { name: 'Primeira Consulta', value: 45, color: '#00ff88' },
    { name: 'Retorno', value: 35, color: '#00cc6a' },
    { name: 'Exames', value: 20, color: '#00aa55' }
  ];

  const returnData = [
    { month: 'Jan', primeira: 120, retorno: 80 },
    { month: 'Fev', primeira: 130, retorno: 95 },
    { month: 'Mar', primeira: 125, retorno: 110 },
    { month: 'Abr', primeira: 140, retorno: 125 },
    { month: 'Mai', primeira: 135, retorno: 140 },
    { month: 'Jun', primeira: 150, retorno: 155 }
  ];

  const kpiCards = [
    {
      title: "Agendamentos Hoje",
      value: "47",
      icon: Calendar,
      trend: "+12%",
      color: "text-primary"
    },
    {
      title: "Tempo Médio de Agendamento",
      value: "2.3min",
      icon: Clock,
      trend: "-65%",
      color: "text-primary"
    },
    {
      title: "Taxa de Resposta Imediata",
      value: "94%",
      icon: TrendingUp,
      trend: "+18%",
      color: "text-primary"
    },
    {
      title: "Faltas Reagendadas",
      value: "89%",
      icon: UserCheck,
      trend: "+25%",
      color: "text-primary"
    },
    {
      title: "Pacientes Retornando",
      value: "156",
      icon: Users,
      trend: "+31%",
      color: "text-primary"
    },
    {
      title: "ROI Estimado",
      value: "340%",
      icon: TrendingUp,
      trend: "+45%",
      color: "text-primary"
    },
    {
      title: "Economia de Tempo",
      value: "120h/mês",
      icon: Timer,
      trend: "+55%",
      color: "text-primary"
    },
    {
      title: "Economia Financeira",
      value: "R$ 28.000",
      icon: DollarSign,
      trend: "+67%",
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border flex items-center px-6 shadow-card">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 hover:bg-secondary"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-neo rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">NeoTime AI</h1>
        </div>

        <div className="ml-auto">
          <Badge variant="secondary" className="bg-gradient-neo text-primary-foreground">
            {companyName}
          </Badge>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-16 h-full bg-card border-r border-border transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <div className="p-6">
            <nav className="space-y-2">
              <Button variant="secondary" className="w-full justify-start bg-primary text-primary-foreground">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6 space-y-6">
            {/* Welcome Message */}
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo(a), {companyName}!
              </h1>
              <p className="text-muted-foreground">
                Acompanhe o impacto da IA NeoTime em sua clínica
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
              {kpiCards.map((kpi, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-neo transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                    <p className="text-xs text-primary">
                      {kpi.trend} em relação ao mês anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Appointments Chart */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Agendamentos por Dia da Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }} 
                      />
                      <Bar dataKey="agendamentos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Time Savings Chart */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Economia de Tempo (Horas)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="antes" fill="hsl(var(--muted))" name="Antes" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="depois" fill="hsl(var(--primary))" name="Depois" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Financial Savings Chart */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Economia Financeira Estimada (R$)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="economia" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Service Type Distribution */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Distribuição por Tipo de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }} 
                      />
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Return vs First Visit Chart */}
              <Card className="bg-gradient-card border-border lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-foreground">Retorno vs Primeira Consulta</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={returnData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="primeira" 
                        stroke="hsl(var(--muted))" 
                        strokeWidth={2}
                        name="Primeira Consulta"
                        dot={{ fill: "hsl(var(--muted))", strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="retorno" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Retorno"
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}