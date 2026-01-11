import { useState, FormEvent } from 'react';

interface AdjustLevelsFormProps {
  onSubmit: (params: any) => void;
  loading: boolean;
  onBack: () => void;
}

export default function AdjustLevelsForm({ onSubmit, loading, onBack }: AdjustLevelsFormProps) {
  const [activity, setActivity] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ activity });
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-bold">←</button>
        <div>
          <h2 className="text-3xl font-black text-indigo-900">Adaptação de Níveis</h2>
          <p className="text-sm text-indigo-600">Adapte atividades em 3 níveis: fácil, médio e difícil</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Cole a atividade original</label>
          <textarea value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none h-40" placeholder="Cole aqui a atividade que deseja adaptar..." required />
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50">
          {loading ? '✨ Adaptando...' : '✨ Gerar 3 Níveis'}
        </button>
      </form>
    </div>
  );
}
