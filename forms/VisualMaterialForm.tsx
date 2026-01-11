import { useState, FormEvent } from 'react';

interface VisualMaterialFormProps {
  onSubmit: (params: any) => void;
  loading: boolean;
  onBack: () => void;
}

export default function VisualMaterialForm({ onSubmit, loading, onBack }: VisualMaterialFormProps) {
  const [materialType, setMaterialType] = useState('');
  const [theme, setTheme] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ materialType, theme });
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-bold">←</button>
        <div>
          <h2 className="text-3xl font-black text-indigo-900">Materiais Visuais</h2>
          <p className="text-sm text-indigo-600">Gere descrições de recursos visuais para suas aulas</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Tipo de material</label>
          <input type="text" value={materialType} onChange={(e) => setMaterialType(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none" placeholder="Ex: Cartaz, mural, painel" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Tema</label>
          <input type="text" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none" placeholder="Ex: Animais da fazenda" required />
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50">
          {loading ? '✨ Gerando...' : '✨ Gerar Material'}
        </button>
      </form>
    </div>
  );
}
