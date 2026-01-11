import { useState, FormEvent } from 'react';

interface ParentSummaryFormProps {
  onSubmit: (params: any) => void;
  loading: boolean;
  onBack: () => void;
}

export default function ParentSummaryForm({ onSubmit, loading, onBack }: ParentSummaryFormProps) {
  const [period, setPeriod] = useState('');
  const [highlights, setHighlights] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ period, highlights });
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-bold">←</button>
        <div>
          <h2 className="text-3xl font-black text-indigo-900">Comunicados aos Pais</h2>
          <p className="text-sm text-indigo-600">Crie mensagens e resumos semanais para as famílias</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Período</label>
          <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none" placeholder="Ex: Semana de 10 a 14 de janeiro" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Destaques da semana</label>
          <textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none h-32" placeholder="Ex: Iniciamos o estudo de vogais, trabalhamos a socialização..." required />
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50">
          {loading ? '✨ Gerando...' : '✨ Gerar Comunicado'}
        </button>
      </form>
    </div>
  );
}
