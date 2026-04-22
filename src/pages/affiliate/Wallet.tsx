import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

// 1. Define the Data Shape for your Payment Service
interface Transaction {
  id: string;
  description: string;
  type: 'commission' | 'withdrawal';
  amount: number;
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

interface WalletData {
  balance: number;
  totalEarned: number;
  pendingAmount: number;
  tierName: string;
  commissionRate: number;
  tierProgress: number;
  transactions: Transaction[];
}

// 2. The Real Fetcher (Points to your Load Balancer on Port 3000)
const fetchWalletData = async (): Promise<WalletData> => {
  const token = localStorage.getItem('accessToken');
  const { data } = await axios.get('http://localhost:3000/api/payments/wallet-stats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data.data; 
};

const Wallet: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery<WalletData>({
    queryKey: ['wallet-data'],
    queryFn: fetchWalletData,
    enabled: !!localStorage.getItem('accessToken'), // Only run if token exists
    retry: 1 // Don't spam the server if it's down
  });

  // 3. Loading State (Crucial for UX)
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-medium">Connecting to Innospace Payment Service...</p>
      </div>
    );
  }

  // 4. Error State (This handles your ERR_CONNECTION_REFUSED gracefully)
  if (isError) {
    return (
      <div className="p-12 max-w-2xl mx-auto mt-20 bg-white border border-slate-100 rounded-[2rem] shadow-xl text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Unavailable</h2>
        <p className="text-slate-500 mb-8">
          We couldn't connect to the payment server. Please ensure the backend services are running.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Wallet</h1>
          <p className="text-slate-500">Manage your earnings</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200">
          Withdraw
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
          <p className="text-slate-400 text-sm mb-1">Total Balance</p>
          <h2 className="text-5xl font-bold">₦{data?.balance.toLocaleString()}</h2>
          
          <div className="mt-10 flex gap-8 border-t border-slate-800 pt-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Pending</p>
              <p className="text-lg font-bold text-yellow-400">₦{data?.pendingAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Rate</p>
              <p className="text-lg font-bold">{data?.commissionRate}%</p>
            </div>
          </div>
          <WalletIcon className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64" />
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col items-center justify-center">
          <h3 className="font-bold text-slate-900">{data?.tierName}</h3>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${data?.tierProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-[10px] uppercase text-slate-400">
              <th className="px-8 py-4">Description</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data?.transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right font-bold">
                  ₦{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;