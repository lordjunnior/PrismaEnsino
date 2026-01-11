import { useState, FormEvent } from 'react';

interface LessonPlanFormProps {
  onSubmit: (params: any) => void;
  loading: boolean;
  onBack: () => void;
}

export default function LessonPlanForm({ onSubmit, loading, onBack }: LessonPlanFormProps) {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ subject, grade, topic, duration });
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border animate-fadeIn">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-bold">←</button>
        <div>
          <h2 className="text-3xl font-black text-indigo-900">Planos de Aula</h2>
          <p className="text-sm text-indigo-600">Crie roteiros completos alinhados à BNCC</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Disciplina</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none" placeholder="Ex: Português" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Ano/Série</label>
          <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none" placeholder="Ex: 2º ano" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Tema da aula</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none" placeholder="Ex: Uso da vírgula" required />
        </div>
        <div>
          <label className="block text-sm font-bold text-indigo-900 mb-2">Duração (minutos)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 outline-none" placeholder="Ex: 60" required min="30" max="120" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50">
          {loading ? '✨ Criando...' : '✨ Criar Plano de Aula'}
        </button>
      </form>
    </div>
  );
}
