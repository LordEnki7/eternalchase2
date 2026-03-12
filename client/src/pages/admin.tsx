import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  Download,
  Truck,
  Mail,
  BookOpen,
  Headphones,
  Star,
  Search,
  Filter,
  Calendar,
  BarChart3,
  Bot,
  Zap,
  Brain,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Target,
  Lightbulb,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Purchase {
  id: string;
  email: string;
  itemId: string;
  itemType: string;
  itemName: string;
  price: number;
  currency: string;
  status: string;
  transactionId: string;
  shippingAddress?: any;
  purchasedAt: string;
}

interface Newsletter {
  id: string;
  email: string;
  cosmicAlignment: string;
  language: string;
  subscribedAt: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingShipments: number;
  digitalDownloads: number;
  physicalBooks: number;
  audiobooks: number;
  recentOrders: Purchase[];
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Check for existing auth on component mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin-authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Admin password (in production, this should be an environment variable)
  const ADMIN_PASSWORD = 'EternalChaseAdmin2025!';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-authenticated', 'true');
      setPassword('');
    } else {
      alert('Incorrect password. Access denied.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-authenticated');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-dark via-cosmic-purple/20 to-space-dark flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="bg-space-dark/80 border-cosmic-gold/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-orbitron text-cosmic-gold mb-2">
                🛡️ Admin Access
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter the admin password to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-space-dark/50 border-cosmic-gold/30 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-cosmic-gold/20 hover:bg-cosmic-gold/40 text-cosmic-gold border border-cosmic-gold/50"
                >
                  Access Dashboard
                </Button>
              </form>
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="text-gray-400 border-gray-600 hover:bg-gray-700/50"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fetch all purchases
  const { data: purchases = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['/api/shop/purchases'],
    queryFn: () => apiRequest('GET', '/api/shop/purchases').then(res => res.json()),
  });

  // Fetch newsletter subscribers
  const { data: newsletters = [], isLoading: newslettersLoading } = useQuery({
    queryKey: ['/api/newsletter/subscribers'],
    queryFn: () => apiRequest('GET', '/api/newsletter/subscribers').then(res => res.json()),
  });

  // Calculate dashboard statistics
  const dashboardStats: DashboardStats = {
    totalRevenue: purchases.reduce((sum: number, p: Purchase) => sum + (p.price / 100), 0),
    totalOrders: purchases.length,
    totalCustomers: new Set(purchases.map((p: Purchase) => p.email)).size,
    pendingShipments: purchases.filter((p: Purchase) => 
      (p.itemType === 'hardcover_book' || p.itemType === 'paperback_book') && 
      p.status === 'completed'
    ).length,
    digitalDownloads: purchases.filter((p: Purchase) => 
      p.itemType === 'digital_book' && p.status === 'completed'
    ).length,
    physicalBooks: purchases.filter((p: Purchase) => 
      (p.itemType === 'hardcover_book' || p.itemType === 'paperback_book')
    ).length,
    audiobooks: purchases.filter((p: Purchase) => p.itemType === 'audiobook').length,
    recentOrders: purchases.slice(-10).reverse()
  };

  // Filter purchases based on search and filters
  const filteredPurchases = purchases.filter((purchase: Purchase) => {
    const matchesSearch = 
      purchase.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    const matchesType = typeFilter === 'all' || purchase.itemType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const updatePurchaseStatus = async (purchaseId: string, newStatus: string) => {
    try {
      await apiRequest('PATCH', `/api/shop/purchase/${purchaseId}/status`, {
        status: newStatus
      });
      // Refetch purchases to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Failed to update purchase status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', text: 'Pending' },
      completed: { color: 'bg-green-500', text: 'Completed' },
      failed: { color: 'bg-red-500', text: 'Failed' },
      refunded: { color: 'bg-gray-500', text: 'Refunded' },
      shipped: { color: 'bg-blue-500', text: 'Shipped' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-500', text: status };
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const getItemTypeIcon = (itemType: string) => {
    switch (itemType) {
      case 'hardcover_book':
      case 'paperback_book':
        return <BookOpen className="w-4 h-4" />;
      case 'digital_book':
        return <Download className="w-4 h-4" />;
      case 'audiobook':
        return <Headphones className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (purchasesLoading || newslettersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-purple-200">
              Manage your Eternal Chase empire
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/40 text-red-300 hover:bg-red-800/20"
            >
              🔒 Logout
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-purple-500/40 text-purple-200 hover:bg-purple-800/20"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${dashboardStats.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {dashboardStats.totalOrders}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {dashboardStats.totalCustomers}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Pending Shipments</CardTitle>
              <Truck className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">
                {dashboardStats.pendingShipments}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-purple-500/20">
              <TabsTrigger value="orders" className="text-purple-200">Orders</TabsTrigger>
              <TabsTrigger value="analytics" className="text-purple-200">Analytics</TabsTrigger>
              <TabsTrigger value="customers" className="text-purple-200">Customers</TabsTrigger>
              <TabsTrigger value="newsletter" className="text-purple-200">Newsletter</TabsTrigger>
              <TabsTrigger value="agents" className="text-cyan-300 font-semibold">🤖 AI Agents</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              {/* Filters */}
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-100">Order Management</CardTitle>
                  <CardDescription className="text-purple-300">
                    Search and filter customer orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                        <Input
                          placeholder="Search by email, item name, or transaction ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-slate-700 border-purple-500/30 text-purple-100"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={statusFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('all')}
                        size="sm"
                      >
                        All
                      </Button>
                      <Button
                        variant={statusFilter === 'pending' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('pending')}
                        size="sm"
                      >
                        Pending
                      </Button>
                      <Button
                        variant={statusFilter === 'completed' ? 'default' : 'outline'}
                        onClick={() => setStatusFilter('completed')}
                        size="sm"
                      >
                        Completed
                      </Button>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="space-y-3">
                    {filteredPurchases.map((purchase: Purchase) => (
                      <div key={purchase.id} className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-purple-300 text-sm font-medium">Order ID</div>
                            <div className="text-purple-100 font-mono text-sm">
                              {purchase.id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-purple-300 text-sm font-medium">Customer</div>
                            <div className="text-purple-100 text-sm">{purchase.email}</div>
                          </div>
                          <div>
                            <div className="text-purple-300 text-sm font-medium">Item</div>
                            <div className="flex items-center gap-2 text-purple-100 text-sm">
                              {getItemTypeIcon(purchase.itemType)}
                              <span className="truncate">{purchase.itemName}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-purple-300 text-sm font-medium">Amount</div>
                            <div className="text-purple-100 font-semibold">
                              ${(purchase.price / 100).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-500/20">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(purchase.status)}
                            <span className="text-purple-300 text-sm">
                              {format(new Date(purchase.purchasedAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePurchaseStatus(purchase.id, 'completed')}
                              disabled={purchase.status === 'completed'}
                            >
                              Mark Complete
                            </Button>
                            {(purchase.itemType === 'hardcover_book' || purchase.itemType === 'paperback_book') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePurchaseStatus(purchase.id, 'shipped')}
                                disabled={purchase.status === 'shipped'}
                              >
                                Mark Shipped
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-purple-100 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Physical Books
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-400 mb-2">
                      {dashboardStats.physicalBooks}
                    </div>
                    <p className="text-purple-300 text-sm">
                      Hardcover & Paperback sales
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-100 flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Digital Downloads
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {dashboardStats.digitalDownloads}
                    </div>
                    <p className="text-green-300 text-sm">
                      Completed digital sales
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-pink-500/20">
                  <CardHeader>
                    <CardTitle className="text-pink-100 flex items-center gap-2">
                      <Headphones className="w-5 h-5" />
                      Audiobooks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-pink-400 mb-2">
                      {dashboardStats.audiobooks}
                    </div>
                    <p className="text-pink-300 text-sm">
                      Audio edition sales
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-6">
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-100">Customer Overview</CardTitle>
                  <CardDescription className="text-purple-300">
                    Unique customers and their purchase history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from(new Set(purchases.map((p: Purchase) => p.email))).map((email: string) => {
                      const customerPurchases = purchases.filter((p: Purchase) => p.email === email);
                      const totalSpent = customerPurchases.reduce((sum: number, p: Purchase) => sum + p.price, 0) / 100;
                      
                      return (
                        <div key={email} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div>
                            <div className="text-purple-200 font-medium">{email}</div>
                            <div className="text-purple-400 text-sm">
                              {customerPurchases.length} orders • ${totalSpent.toFixed(2)} total
                            </div>
                          </div>
                          <Badge className="bg-purple-600">
                            {customerPurchases.length > 3 ? 'VIP' : 'Customer'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletter" className="space-y-6">
              <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Newsletter Subscribers
                  </CardTitle>
                  <CardDescription className="text-purple-300">
                    {newsletters.length} cosmic travelers in your network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {newsletters.map((newsletter: Newsletter) => (
                      <div key={newsletter.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="text-purple-200 font-medium">{newsletter.email}</div>
                          <div className="text-purple-400 text-sm">
                            {newsletter.cosmicAlignment} • {newsletter.language.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-purple-300 text-sm">
                          {format(new Date(newsletter.subscribedAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* AI Agents Command Center Tab */}
            <AgentCommandCenter />

          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// AGENT COMMAND CENTER COMPONENT
// ============================================
function AgentCommandCenter() {
  const [newJobForm, setNewJobForm] = useState({ open: false, title: '', objective: '', category: 'action', whyItMatters: '', expectedImpact: '', estimatedDuration: '1-2 hours', agentsRequired: [] as string[], priorityScore: 70 });
  const [newMemoryForm, setNewMemoryForm] = useState({ open: false, title: '', content: '', memoryType: 'insight', tags: '' });
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data: brief, isLoading: briefLoading, refetch: refetchBrief } = useQuery<any>({
    queryKey: ['/api/agent-command/daily-brief'],
    queryFn: () => apiRequest('GET', '/api/agent-command/daily-brief').then(r => r.json()),
    refetchInterval: 30000,
  });

  const { data: agentList = [], isLoading: agentsLoading } = useQuery<any[]>({
    queryKey: ['/api/agents'],
    queryFn: () => apiRequest('GET', '/api/agents').then(r => r.json()),
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<any[]>({
    queryKey: ['/api/agent-jobs'],
    queryFn: () => apiRequest('GET', '/api/agent-jobs').then(r => r.json()),
  });

  const { data: runs = [], isLoading: runsLoading } = useQuery<any[]>({
    queryKey: ['/api/execution-runs'],
    queryFn: () => apiRequest('GET', '/api/execution-runs').then(r => r.json()),
  });

  const { data: memories = [] } = useQuery<any[]>({
    queryKey: ['/api/agent-memory'],
    queryFn: () => apiRequest('GET', '/api/agent-memory').then(r => r.json()),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest('PATCH', `/api/agents/${id}/status`, { status }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/agent-command/daily-brief'] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, approved, note }: { id: string; approved: boolean; note?: string }) =>
      apiRequest('PATCH', `/api/agent-jobs/${id}/approve`, { approved, note }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/agent-command/daily-brief'] });
    },
  });

  const createJobMutation = useMutation({
    mutationFn: (job: any) => apiRequest('POST', '/api/agent-jobs', job).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent-jobs'] });
      setNewJobForm(f => ({ ...f, open: false, title: '', objective: '', whyItMatters: '', expectedImpact: '' }));
    },
  });

  const createMemoryMutation = useMutation({
    mutationFn: (mem: any) => apiRequest('POST', '/api/agent-memory', mem).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agent-memory'] });
      setNewMemoryForm(f => ({ ...f, open: false, title: '', content: '', tags: '' }));
    },
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      orchestrator: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      growth: 'bg-green-500/20 text-green-300 border-green-500/40',
      revenue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      community: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      development: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      memory: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    };
    return colors[role] || 'bg-gray-500/20 text-gray-300';
  };

  const getStatusDot = (status: string) => {
    if (status === 'active') return 'bg-green-400';
    if (status === 'idle') return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const pendingJobs = jobs.filter((j: any) => j.approvalStatus === 'pending');
  const approvedJobs = jobs.filter((j: any) => j.approvalStatus === 'approved');

  return (
    <TabsContent value="agents" className="space-y-6">
      {/* Daily Executive Brief */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-cyan-900/30 border-cyan-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-100 flex items-center gap-2 text-xl">
              <Activity className="w-6 h-6 text-cyan-400" />
              Daily Executive Brief
            </CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 text-sm">
                {brief?.date ? format(new Date(brief.date), 'MMM dd, yyyy HH:mm') : 'Loading...'}
              </span>
              <Button size="sm" variant="outline" className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-800/20" onClick={() => refetchBrief()}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {briefLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full" />
            </div>
          ) : brief ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{brief.executiveSummary.activeAgents}</div>
                <div className="text-slate-400 text-sm mt-1">Active Agents</div>
              </div>
              <div className="bg-slate-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{brief.executiveSummary.pendingApprovals}</div>
                <div className="text-slate-400 text-sm mt-1">Pending Approvals</div>
              </div>
              <div className="bg-slate-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{brief.executiveSummary.completedToday}</div>
                <div className="text-slate-400 text-sm mt-1">Completed Today</div>
              </div>
              <div className="bg-slate-700/40 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">{brief.executiveSummary.memoriesStored}</div>
                <div className="text-slate-400 text-sm mt-1">Memories Stored</div>
              </div>
            </div>
          ) : null}

          {/* Agent Performance Row */}
          {brief?.agentMetrics && (
            <div>
              <h4 className="text-slate-300 text-sm font-semibold mb-3 uppercase tracking-wider">Agent Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {brief.agentMetrics.map((m: any) => (
                  <div key={m.agentId} className="bg-slate-700/30 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 text-sm font-medium">{m.agentName}</div>
                      <div className="text-slate-400 text-xs">{m.tasksCompleted} tasks • Q: {m.avgQualityScore}/10</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(m.status)}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Registry */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-purple-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            Agent Registry
          </CardTitle>
          <CardDescription className="text-purple-300">
            {agentList.length} agents deployed in the Eternal Chase ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agentsLoading ? (
            <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentList.map((agent: any) => (
                <div key={agent.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot(agent.status)}`} />
                      <span className="text-slate-100 font-semibold">{agent.agentName}</span>
                    </div>
                    <Badge className={`text-xs border ${getRoleColor(agent.role)}`}>{agent.role}</Badge>
                  </div>
                  <p className="text-slate-400 text-xs mb-3 leading-relaxed">{agent.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(agent.capabilities as string[]).slice(0, 3).map((cap: string) => (
                      <span key={cap} className="bg-slate-600/40 text-slate-300 text-xs px-2 py-0.5 rounded">
                        {cap.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="text-slate-500 text-xs">+{agent.capabilities.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {agent.status !== 'active' && (
                      <Button size="sm" className="text-xs h-7 bg-green-700/30 text-green-300 hover:bg-green-700/50 border border-green-600/30"
                        onClick={() => statusMutation.mutate({ id: agent.id, status: 'active' })}>
                        Activate
                      </Button>
                    )}
                    {agent.status !== 'idle' && (
                      <Button size="sm" className="text-xs h-7 bg-yellow-700/30 text-yellow-300 hover:bg-yellow-700/50 border border-yellow-600/30"
                        onClick={() => statusMutation.mutate({ id: agent.id, status: 'idle' })}>
                        Set Idle
                      </Button>
                    )}
                    {agent.status !== 'disabled' && (
                      <Button size="sm" className="text-xs h-7 bg-red-700/30 text-red-300 hover:bg-red-700/50 border border-red-600/30"
                        onClick={() => statusMutation.mutate({ id: agent.id, status: 'disabled' })}>
                        Disable
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Queue */}
      <Card className="bg-slate-800/50 border-yellow-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Approval Queue
              {pendingJobs.length > 0 && (
                <Badge className="bg-yellow-500 text-black ml-2">{pendingJobs.length}</Badge>
              )}
            </CardTitle>
            <Button
              size="sm"
              className="bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/50"
              onClick={() => setNewJobForm(f => ({ ...f, open: !f.open }))}
            >
              + Propose New Task
            </Button>
          </div>
          <CardDescription className="text-yellow-300/70">
            Review and approve tasks before agents execute them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* New Job Form */}
          {newJobForm.open && (
            <div className="bg-slate-700/40 rounded-lg p-4 border border-cyan-500/30 space-y-3">
              <h4 className="text-cyan-300 font-semibold text-sm">New Task Proposal</h4>
              <Input placeholder="Task title" value={newJobForm.title} onChange={e => setNewJobForm(f => ({ ...f, title: e.target.value }))}
                className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" />
              <Textarea placeholder="Objective — what should this task accomplish?" value={newJobForm.objective}
                onChange={e => setNewJobForm(f => ({ ...f, objective: e.target.value }))}
                className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" rows={2} />
              <Textarea placeholder="Why it matters for Eternal Chase" value={newJobForm.whyItMatters}
                onChange={e => setNewJobForm(f => ({ ...f, whyItMatters: e.target.value }))}
                className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" rows={2} />
              <Textarea placeholder="Expected impact if completed" value={newJobForm.expectedImpact}
                onChange={e => setNewJobForm(f => ({ ...f, expectedImpact: e.target.value }))}
                className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" rows={2} />
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-slate-400 text-xs mb-1 block">Category</label>
                  <select value={newJobForm.category} onChange={e => setNewJobForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-600/40 border border-slate-500/40 text-slate-200 text-sm rounded px-3 py-2">
                    <option value="action">Action</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="quick_win">Quick Win</option>
                    <option value="analysis">Analysis</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-slate-400 text-xs mb-1 block">Priority Score (1-100)</label>
                  <Input type="number" min={1} max={100} value={newJobForm.priorityScore}
                    onChange={e => setNewJobForm(f => ({ ...f, priorityScore: parseInt(e.target.value) || 50 }))}
                    className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" />
                </div>
                <div className="flex-1">
                  <label className="text-slate-400 text-xs mb-1 block">Estimated Duration</label>
                  <Input placeholder="e.g. 2-3 hours" value={newJobForm.estimatedDuration}
                    onChange={e => setNewJobForm(f => ({ ...f, estimatedDuration: e.target.value }))}
                    className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-cyan-600/50 text-cyan-100 hover:bg-cyan-600/70"
                  disabled={createJobMutation.isPending || !newJobForm.title || !newJobForm.objective}
                  onClick={() => createJobMutation.mutate({
                    title: newJobForm.title, objective: newJobForm.objective, category: newJobForm.category,
                    whyItMatters: newJobForm.whyItMatters, expectedImpact: newJobForm.expectedImpact,
                    priorityScore: newJobForm.priorityScore, agentsRequired: [], assetsRequired: [],
                    estimatedDuration: newJobForm.estimatedDuration, approvalStatus: 'pending',
                  })}>
                  {createJobMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
                </Button>
                <Button size="sm" variant="outline" className="border-slate-500/40 text-slate-400"
                  onClick={() => setNewJobForm(f => ({ ...f, open: false }))}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {jobsLoading ? (
            <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto" />
          ) : pendingJobs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-600/50" />
              <p>No tasks pending approval</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJobs.map((job: any) => (
                <div key={job.id} className="bg-slate-700/30 rounded-lg border border-yellow-500/20">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100">{job.title}</span>
                        <Badge className="bg-yellow-600/30 text-yellow-300 border border-yellow-500/40 text-xs">{job.category}</Badge>
                        <Badge className="bg-slate-600/40 text-slate-300 text-xs">Score: {job.priorityScore}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" className="text-slate-400 h-7 w-7 p-0"
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
                        {expandedJob === job.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-slate-400 text-sm">{job.objective}</p>
                    {expandedJob === job.id && (
                      <div className="mt-3 space-y-2 pt-3 border-t border-slate-600/40">
                        {job.whyItMatters && <div><span className="text-slate-500 text-xs uppercase">Why It Matters: </span><span className="text-slate-300 text-sm">{job.whyItMatters}</span></div>}
                        {job.expectedImpact && <div><span className="text-slate-500 text-xs uppercase">Expected Impact: </span><span className="text-slate-300 text-sm">{job.expectedImpact}</span></div>}
                        {job.estimatedDuration && <div><span className="text-slate-500 text-xs uppercase">Duration: </span><span className="text-slate-300 text-sm">{job.estimatedDuration}</span></div>}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-green-700/40 text-green-300 hover:bg-green-700/60 border border-green-600/30"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate({ id: job.id, approved: true })}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" className="bg-red-700/30 text-red-300 hover:bg-red-700/50 border border-red-600/30"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate({ id: job.id, approved: false, note: 'Rejected by admin' })}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Approved jobs list */}
          {approvedJobs.length > 0 && (
            <div>
              <h4 className="text-green-400 text-sm font-semibold uppercase tracking-wider mb-3">Approved Tasks</h4>
              <div className="space-y-2">
                {approvedJobs.slice(0, 5).map((job: any) => (
                  <div key={job.id} className="bg-green-900/10 rounded-lg p-3 border border-green-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-slate-200 text-sm font-medium">{job.title}</span>
                      <span className="text-slate-400 text-xs ml-2">{job.estimatedDuration}</span>
                    </div>
                    <Badge className="bg-green-700/30 text-green-300 border border-green-500/30 text-xs">Approved</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-blue-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Execution History
          </CardTitle>
          <CardDescription className="text-blue-300/70">
            Last {runs.length} agent task runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {runsLoading ? (
            <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto" />
          ) : runs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Activity className="w-10 h-10 mx-auto mb-3 text-blue-600/50" />
              <p>No execution runs yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {runs.map((run: any) => (
                <div key={run.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 text-sm font-medium">{run.taskName}</div>
                    <div className="text-slate-400 text-xs">
                      {run.agent?.agentName} • {run.startTime ? format(new Date(run.startTime), 'MMM dd HH:mm') : '—'}
                      {run.totalDurationMs && ` • ${Math.round(run.totalDurationMs / 1000)}s`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {run.qualityScore && <span className="text-slate-400 text-xs">Q:{run.qualityScore}/10</span>}
                    <Badge className={
                      run.executionStatus === 'completed' ? 'bg-green-700/30 text-green-300 border border-green-500/30 text-xs' :
                      run.executionStatus === 'failed' ? 'bg-red-700/30 text-red-300 border border-red-500/30 text-xs' :
                      'bg-blue-700/30 text-blue-300 border border-blue-500/30 text-xs'
                    }>{run.executionStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Memory Bank */}
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Agent Memory Bank
            </CardTitle>
            <Button
              size="sm"
              className="bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/50"
              onClick={() => setNewMemoryForm(f => ({ ...f, open: !f.open }))}
            >
              + Add Memory
            </Button>
          </div>
          <CardDescription className="text-cyan-300/70">
            Shared knowledge base — agents learn from stored insights over time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {newMemoryForm.open && (
            <div className="bg-slate-700/40 rounded-lg p-4 border border-cyan-500/30 space-y-3">
              <h4 className="text-cyan-300 font-semibold text-sm">Add to Memory Bank</h4>
              <Input placeholder="Memory title" value={newMemoryForm.title}
                onChange={e => setNewMemoryForm(f => ({ ...f, title: e.target.value }))}
                className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" />
              <Textarea placeholder="What should agents remember? (insight, strategy, result, lesson learned)" value={newMemoryForm.content}
                onChange={e => setNewMemoryForm(f => ({ ...f, content: e.target.value }))}
                className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" rows={3} />
              <div className="flex gap-3">
                <div className="flex-1">
                  <select value={newMemoryForm.memoryType} onChange={e => setNewMemoryForm(f => ({ ...f, memoryType: e.target.value }))}
                    className="w-full bg-slate-600/40 border border-slate-500/40 text-slate-200 text-sm rounded px-3 py-2">
                    <option value="insight">Insight</option>
                    <option value="strategy">Strategy</option>
                    <option value="result">Result</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Input placeholder="Tags (comma separated)" value={newMemoryForm.tags}
                    onChange={e => setNewMemoryForm(f => ({ ...f, tags: e.target.value }))}
                    className="bg-slate-600/40 border-slate-500/40 text-slate-200 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-cyan-600/50 text-cyan-100 hover:bg-cyan-600/70"
                  disabled={createMemoryMutation.isPending || !newMemoryForm.title || !newMemoryForm.content}
                  onClick={() => createMemoryMutation.mutate({
                    title: newMemoryForm.title, content: newMemoryForm.content,
                    memoryType: newMemoryForm.memoryType,
                    tags: newMemoryForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
                    relevanceScore: 75,
                  })}>
                  {createMemoryMutation.isPending ? 'Saving...' : 'Store in Memory'}
                </Button>
                <Button size="sm" variant="outline" className="border-slate-500/40 text-slate-400"
                  onClick={() => setNewMemoryForm(f => ({ ...f, open: false }))}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {memories.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Brain className="w-10 h-10 mx-auto mb-3 text-cyan-600/50" />
              <p>No memories stored yet</p>
              <p className="text-xs mt-1">Add insights, strategies, and lessons learned to help agents improve</p>
            </div>
          ) : (
            <div className="space-y-3">
              {memories.map((mem: any) => (
                <div key={mem.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-slate-100 font-medium text-sm">{mem.title}</span>
                    <Badge className={`text-xs border ml-2 flex-shrink-0 ${
                      mem.memoryType === 'insight' ? 'bg-cyan-700/30 text-cyan-300 border-cyan-500/30' :
                      mem.memoryType === 'strategy' ? 'bg-purple-700/30 text-purple-300 border-purple-500/30' :
                      mem.memoryType === 'result' ? 'bg-green-700/30 text-green-300 border-green-500/30' :
                      'bg-red-700/30 text-red-300 border-red-500/30'
                    }`}>{mem.memoryType}</Badge>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-2">{mem.content}</p>
                  {mem.tags && (mem.tags as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(mem.tags as string[]).map((tag: string) => (
                        <span key={tag} className="bg-slate-600/40 text-slate-400 text-xs px-2 py-0.5 rounded">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="text-slate-500 text-xs mt-2">
                    Relevance: {mem.relevanceScore}/100 • {mem.createdAt ? format(new Date(mem.createdAt), 'MMM dd, yyyy') : '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}