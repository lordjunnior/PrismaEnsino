import { useState, FormEvent } from 'react';

interface ActivityFormProps {
  onSubmit: (params: any) => void;
  loading: boolean;
  onBack: () => void;
  userPlan: 'free' | 'pro' | 'premium';
  creationsToday: number;
}

export default function ActivityForm({ onSubmit, loading, onBack, userPlan, creationsToday }: ActivityFormProps) {
  const [age, setAge] = useState('');
  const [difficulty, setDifficulty] = useState('facil');
  const [objective, setObjective] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ age, difficulty, objective, duration });
  };

  const remaining = userPlan === 'free' ? 3 - creationsToday : '∞';

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-bold">←</button>
        <div>
          <h2 className="text-3xl font-black text-indigo-900">Atividades</h2>
          <p className="text-sm text-indigo-600">Crie exercícios pedagógicos personalizados</p>
        </div>
      </div>

      {userPlan === 'free' && (
        <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Criações restantes hoje:</strong> {remaining}/3
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Idade da criança</label>
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
            placeholder="Ex: 6"
            required
            min="4"
            max="10"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Dificuldade</label>
          <select 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
          >
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Objetivo da atividade</label>
          <input 
            type="text" 
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
            placeholder="Ex: Ensinar a ler"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Duração (minutos)</label>
          <input 
            type="number" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none font-medium"
            placeholder="Ex: 15"
            required
            min="5"
            max="60"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '✨ Criando...' : '✨ Criar Atividade'}
        </button>
      </form>
    </div>
  );
}
