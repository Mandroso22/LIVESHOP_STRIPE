"use client";

import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Video,
  X,
  LucideIcon,
  Loader2,
  MapPin,
} from "lucide-react";

type OrderStatus = "pending" | "paid" | "preparing" | "shipped" | "delivered";

interface Order {
  id: string;
  reference: string;
  amount: number;
  tiktokPseudo: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  shippingMethod: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
}

interface Product {
  id: string;
  reference: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

interface StatusConfig {
  color: string;
  icon: LucideIcon;
  label: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
  pending: {
    color: "text-amber-300 bg-amber-500/20 border-amber-500/30",
    icon: Clock,
    label: "En attente",
  },
  paid: {
    color: "text-green-300 bg-green-500/20 border-green-500/30",
    icon: CheckCircle,
    label: "Payé",
  },
  preparing: {
    color: "text-blue-300 bg-blue-500/20 border-blue-500/30",
    icon: Package,
    label: "Préparation",
  },
  shipped: {
    color: "text-purple-300 bg-purple-500/20 border-purple-500/30",
    icon: TrendingUp,
    label: "Expédié",
  },
  delivered: {
    color: "text-cyan-300 bg-cyan-500/20 border-cyan-500/30",
    icon: CheckCircle,
    label: "Livré",
  },
};

const tabs: TabConfig[] = [
  { id: "dashboard", label: "Tableau de bord", icon: TrendingUp },
  { id: "orders", label: "Commandes", icon: Package },
  { id: "products", label: "Produits", icon: Plus },
];

export default function AdminDashboard(): ReactElement {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les commandes au montage du composant
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/orders");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des commandes");
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [products] = useState<Product[]>([
    {
      id: "1",
      reference: "PROD001",
      name: "Lot Beauté Premium",
      price: 45.0,
      description: "Kit complet de soins visage",
      stock: 15,
      isActive: true,
      createdAt: "2025-06-01T09:00:00Z",
    },
    {
      id: "2",
      reference: "PROD002",
      name: "Pack Wellness",
      price: 29.9,
      description: "Accessoires bien-être",
      stock: 8,
      isActive: true,
      createdAt: "2025-06-02T11:30:00Z",
    },
  ]);

  const getStatusBadge = (status: OrderStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tiktokPseudo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    activeProducts: products.filter((product) => product.isActive).length,
  };

  // Modifier la section de chargement des commandes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <X className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-white/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-stone-100 uppercase tracking-wider">
                L&apos;avenue 120
              </h1>
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mt-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-amber-300 font-medium">
                  Dashboard Admin
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <span className="text-white/70 text-sm">Live TikTok</span>
                <div className="flex items-center gap-2 mt-1">
                  <Video className="w-4 h-4 text-pink-400" />
                  <span className="text-white font-medium">127 viewers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Commandes</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <Package className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">
                      Chiffre d&apos;affaires
                    </p>
                    <p className="text-2xl font-bold text-white">
                      €{stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">En attente</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.pendingOrders}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-500/20 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Produits actifs</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.activeProducts}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">
                Dernières commandes
              </h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {order.reference.slice(-2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {order.reference}
                        </p>
                        <p className="text-white/70 text-sm">
                          {order.customerName} • {order.tiktokPseudo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-cyan-400 font-bold">
                        €{order.amount}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Rechercher par référence, nom ou pseudo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 backdrop-blur-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="preparing">Préparation</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
              </select>
            </div>

            {/* Orders List */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">
                  Commandes ({filteredOrders.length})
                </h3>
              </div>
              <div className="divide-y divide-white/10">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">
                            {order.reference.slice(-2)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-bold">
                              {order.reference}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-white/70 text-sm">
                            {order.customerName} • {order.tiktokPseudo}
                          </p>
                          <p className="text-white/50 text-xs mt-1">
                            {order.address}, {order.postalCode} {order.city}
                          </p>
                          <p className="text-white/50 text-xs">
                            {new Date(order.createdAt).toLocaleString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-cyan-400 font-bold text-lg">
                            €{order.amount}
                          </p>
                          <p className="text-white/50 text-sm">
                            {order.shippingMethod}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                            title="Télécharger"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                Gestion des produits
              </h3>
              <button
                onClick={() => {
                  /* TODO: Implement new product modal */
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Nouveau produit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">
                        {product.name}
                      </h4>
                      <p className="text-white/70 text-sm mb-2">
                        {product.reference}
                      </p>
                      <p className="text-white/60 text-sm">
                        {product.description}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.isActive
                          ? "text-green-300 bg-green-500/20"
                          : "text-red-300 bg-red-500/20"
                      }`}
                    >
                      {product.isActive ? "Actif" : "Inactif"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-cyan-400 font-bold text-xl">
                      €{product.price}
                    </span>
                    <span className="text-white/70">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 sticky top-0 bg-neutral-900 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Détails de la commande
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      Référence: {selectedOrder.reference}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/70 text-sm">Statut</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-sm">Montant</label>
                    <p className="text-cyan-400 font-bold text-xl">
                      €{selectedOrder.amount}
                    </p>
                  </div>
                </div>

                {/* Informations client */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-400" />
                    Informations client
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/70 text-sm">Client</label>
                      <p className="text-white font-medium">
                        {selectedOrder.customerName}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-pink-400 font-medium">
                          {selectedOrder.tiktokPseudo}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedOrder.tiktokPseudo
                            );
                            alert("Pseudo TikTok copié !");
                          }}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Copier le pseudo"
                        >
                          <svg
                            className="w-4 h-4 text-white/70"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-white/70 text-sm">Contact</label>
                      <p className="text-white/90 text-sm">
                        {selectedOrder.email}
                      </p>
                      <p className="text-white/90 text-sm mt-1">
                        {selectedOrder.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    Adresse de livraison
                  </h4>
                  <div className="space-y-1">
                    <p className="text-white font-medium">
                      {selectedOrder.address}
                    </p>
                    <p className="text-white">
                      {selectedOrder.postalCode} {selectedOrder.city}
                    </p>
                    <p className="text-white/70 text-sm mt-2">
                      Mode de livraison: {selectedOrder.shippingMethod}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/70 text-sm">
                      Date de commande
                    </label>
                    <p className="text-white">
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                  {selectedOrder.paidAt && (
                    <div>
                      <label className="text-white/70 text-sm">
                        Date de paiement
                      </label>
                      <p className="text-white">
                        {new Date(selectedOrder.paidAt).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
