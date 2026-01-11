import { useState, FormEvent } from 'react';

interface UnifiedStoryFormProps {
  onSubmit: (params: any) => void;
  loading: boolean;
  onBack: () => void;
  userPlan: 'free' | 'pro' | 'premium';
  onUpgrade: () => void;
}

export default function UnifiedStoryForm({ onSubmit, loading, onBack, userPlan, onUpgrade }: UnifiedStoryFormProps) {
  const [mode, setMode] = useState<'educational' | 'sleep'>('educational');
  const [childName, setChildName] = useState('');
  const [theme, setTheme] = useState('');
  const [moral, setMoral] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ mode, childName, theme, moral });
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-bold">←</button>
        <div>
          <h2 className="text-3xl font-black text-indigo-900">Contos</h2>
          <p className="text-sm text-indigo-600">Gere histórias personalizadas com narração em áudio</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMode('educational')}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all ${mode === 'educational' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          📚 Educativa
        </button>
        <button 
          onClick={() => setMode('sleep')}
          className={`flex-1 py-4 rounded-2xl font-bold transition-all ${mode === 'sleep' ? 'bg-indigo-900 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          🌙 Para Dormir
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Nome da criança (opcional)</label>
          <input 
            type="text" 
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
            placeholder="Ex: Maria"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Tema da história</label>
          <input 
            type="text" 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
            placeholder="Ex: Amizade"
            required
          />
        </div>

        {mode === 'educational' && (
          <div>
            <label className="block text-sm font-bold text-indigo-900 mb-2">Moral/Lição</label>
            <input 
              type="text" 
              value={moral}
              onChange={(e) => setMoral(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
              placeholder="Ex: Importância de ajudar os outros"
            />
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? '✨ Criando...' : '✨ Criar Conto'}
        </button>
      </form>
    </div>
  );
}
