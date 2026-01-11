import React, { useState, useRef, useEffect } from 'react';
import { AppView, ActivityParams, LessonPlanParams, ParentSummaryParams, ActivityAdjustmentParams, VisualMaterialParams, StoryParams } from './types';
import { geminiService } from './services/geminiService';

type UserPlan = 'free' | 'pro' | 'premium';

const Paywall = ({ feature, planRequired = 'pro', onUpgrade, onBack }: { feature: string; planRequired?: 'pro' | 'premium'; onUpgrade: () => void; onBack: () => void }) => (
  <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-fadeIn">
    <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <div className="text-6xl mb-6">{planRequired === 'pro' ? '💎' : '🏫'}</div>
      <h2 className="text-3xl font-black text-indigo-900 mb-4">
        {planRequired === 'pro' ? 'Recurso Pro' : 'Recurso Premium'}
      </h2>
      <p className="text-lg text-gray-500 mb-8 font-medium leading-relaxed">
        {planRequired === 'pro' ? (
          <>
            O recurso <span className="font-bold text-indigo-600">{feature}</span> é exclusivo do Plano Pro.<br/>
            Desbloqueie áudio, PDF, planos de aula e muito mais agora mesmo.
          </>
        ) : (
          "Esse recurso é exclusivo do Plano Premium, ideal para escolas e cursinhos que precisam organizar e padronizar materiais pedagógicos."
        )}
      </p>
      <div className="space-y-4">
        <button 
          onClick={onUpgrade}
          className={`w-full py-5 text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 ${planRequired === 'pro' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-purple-600 shadow-purple-100'}`}
        >
          <span>{planRequired === 'pro' ? '👉 Ativar Plano Pro' : '👉 Conhecer Plano Premium'}</span>
        </button>
        <button 
          onClick={onBack}
          className="w-full py-4 text-gray-400 font-bold hover:text-indigo-600 transition-colors"
        >
          Voltar para o início
        </button>
      </div>
    </div>
  </div>
);

const LimitReached = ({ onUpgrade, onBack }: { onUpgrade: () => void; onBack: () => void }) => (
  <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-fadeIn">
    <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-amber-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-3xl font-black text-indigo-900 mb-4">Limite Diário Atingido</h2>
      <p className="text-lg text-gray-500 mb-8 font-medium leading-relaxed">
        Você atingiu o limite de 3 criações do Plano Free para hoje. Para criar sem limites e apoiar sua jornada pedagógica, junte-se ao time Pro!
      </p>
      <div className="space-y-4">
        <button 
          onClick={onUpgrade}
          className="w-full py-5 bg-amber-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-amber-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          <span>👉 Desbloquear Uso Ilimitado</span>
        </button>
        <button 
          onClick={onBack}
          className="w-full py-4 text-gray-400 font-bold hover:text-amber-600 transition-colors"
        >
          Continuar no Plano Free
        </button>
      </div>
    </div>
  </div>
);

const ProLimitWarning = ({ onClose, onUpgradePremium }: { onClose: () => void; onUpgradePremium: () => void }) => {
  const nextResetDate = new Date();
  nextResetDate.setDate(nextResetDate.getDate() + 10);
  const dateString = nextResetDate.toLocaleDateString('pt-BR');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fadeIn overflow-y-auto">
      <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl max-w-xl w-full relative border-4 border-amber-100">
         <button onClick={onClose} className="absolute top-6 right-8 text-gray-300 hover:text-gray-500 font-bold text-2xl transition-colors">✕</button>
         
         <div className="text-center mb-8">
             <span className="text-6xl block mb-4 animate-bounce">⚠️</span>
             <h2 className="text-2xl font-black text-indigo-900 leading-tight">Você já usou 240 das suas 300 criações este mês!</h2>
         </div>

         <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
            <p className="text-lg">Olá! 👋<br/>Você está arrasando! 🎉 Restam apenas 60 criações até <strong>{dateString}</strong>.</p>
            
            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                <p className="font-black text-indigo-900 mb-4 text-sm uppercase tracking-wider">🤔 Precisa de mais?</p>
                
                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-2xl border border-indigo-50 shadow-sm hover:border-indigo-200 transition-all cursor-pointer">
                        <p className="font-bold text-indigo-800">Opção 1: Pacotes Extras</p>
                        <p className="text-sm text-gray-500">• +100 criações por R$ 14,90<br/>• +200 criações por R$ 24,90</p>
                    </div>
                    
                    <div onClick={onUpgradePremium} className="p-4 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm hover:border-purple-300 transition-all cursor-pointer group">
                        <p className="font-bold text-purple-800 flex justify-between">Opção 2: Upgrade Premium <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">Recomendado</span></p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">• 1.000 criações/mês<br/>• R$ 149/mês</p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-gray-100 opacity-60">
                         <p className="font-bold text-gray-500">Opção 3: Aguardar o reset</p>
                         <p className="text-sm text-gray-400">Renovação automática em {dateString}.</p>
                    </div>
                </div>
            </div>
            
            <button onClick={onClose} className="w-full py-4 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-all">Entendi, vou continuar assim</button>
         </div>
         
         <p className="text-center text-xs text-indigo-300 font-bold mt-4 uppercase tracking-widest">Equipe PRISMA ENSINO 💜</p>
      </div>
    </div>
  );
};

const BNCCExplanation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border-t-2 border-dashed border-indigo-100 pt-6 no-print">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-900 p-5 rounded-2xl flex items-center justify-between transition-all group border border-blue-100"
        >
            <span className="font-black flex items-center gap-3 text-sm uppercase tracking-wide">
                <span className="text-xl">📘</span> Entenda os códigos BNCC
            </span>
            <span className={`transform transition-transform duration-300 text-blue-400 ${isOpen ? 'rotate-180' : ''}`}>
                ▼
            </span>
        </button>

        {isOpen && (
            <div className="mt-4 bg-white border-2 border-blue-50 p-6 rounded-2xl animate-fadeIn shadow-sm">
                <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                  Os códigos como <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold text-sm">EF02LP09</span> seguem este padrão:
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50/50 p-4 rounded-xl text-center border border-blue-100/50">
                        <span className="block text-2xl font-black text-blue-600 mb-1">EF</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Ensino Fundamental</span>
                    </div>
                    <div className="bg-blue-50/50 p-4 rounded-xl text-center border border-blue-100/50">
                        <span className="block text-2xl font-black text-blue-600 mb-1">02</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Ano escolar (2º ano)</span>
                    </div>
                    <div className="bg-blue-50/50 p-4 rounded-xl text-center border border-blue-100/50">
                        <span className="block text-2xl font-black text-blue-600 mb-1">LP</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Componente (Líng. Port.)</span>
                    </div>
                    <div className="bg-blue-50/50 p-4 rounded-xl text-center border border-blue-100/50">
                        <span className="block text-2xl font-black text-blue-600 mb-1">09</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Habilidade Específica</span>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl border-l-4 border-blue-400">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Exemplo prático</p>
                    <p className="font-medium text-gray-700"><strong>EF02LP09</strong> = Habilidade 09 de Língua Portuguesa do 2º ano do Ensino Fundamental</p>
                </div>

                <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 flex gap-4 items-start">
                    <span className="text-2xl mt-1">💡</span>
                    <div>
                        <p className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-wide">Por que isso é importante?</p>
                        <p className="text-amber-800/80 text-sm leading-relaxed">Esses códigos são obrigatórios em documentações pedagógicas e facilitam o alinhamento com a Base Nacional Comum Curricular (BNCC).</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const WelcomeProView = ({ onStart }: { onStart: () => void }) => {
  const nextPaymentDate = new Date();
  nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
  const dateString = nextPaymentDate.toLocaleDateString('pt-BR');

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-fadeIn font-medium">
      <div className="bg-white rounded-[3rem] shadow-2xl border-4 border-indigo-100 overflow-hidden relative">
         <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
                <span className="text-6xl mb-4 block animate-bounce">🎉</span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">Bem-vinda ao PRISMA ENSINO!</h2>
                <p className="text-indigo-200 uppercase tracking-widest text-xs font-bold">Assinatura Pro Confirmada</p>
            </div>
         </div>
         
         <div className="p-8 md:p-12 space-y-8 text-gray-600 text-lg leading-relaxed">
            <div>
              <p className="mb-4 text-xl text-indigo-900 font-bold">Olá! 👋</p>
              <p>Que alegria ter você no PRISMA ENSINO! ❤️</p>
              <p>A partir de agora, você tem acesso liberado a:</p>
            </div>

            <ul className="space-y-3 bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-50">
              <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✅</span> <strong>300 criações por mês</strong> (atividades, contos, planos de aula)</li>
              <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✅</span> <strong>100 narrações em áudio</strong> com voz humana</li>
              <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✅</span> Materiais alinhados à BNCC</li>
              <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✅</span> Contos personalizados com nome das crianças</li>
              <li className="flex items-center gap-3"><span className="text-green-500 text-xl">✅</span> Download em PDF sem marca d'água</li>
            </ul>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                   <h3 className="font-black text-indigo-900 mb-4 flex items-center gap-2">🎯 PRIMEIROS PASSOS</h3>
                   <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Comece criando sua primeira atividade</li>
                      <li>Explore os diferentes tipos de conteúdo</li>
                      <li>Salve seus favoritos para reutilizar</li>
                   </ol>
                </div>
                
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                   <h3 className="font-black text-amber-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">💡 Dica de Ouro</h3>
                   <p className="text-sm text-amber-900/80 italic">
                     Use a função <strong>"Adaptação de Níveis"</strong> para criar 3 versões da mesma atividade (fácil, média, difícil). Perfeito para inclusão escolar!
                   </p>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100 text-center space-y-4">
                <button onClick={onStart} className="w-full py-5 bg-indigo-600 text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
                  Começar a Criar Agora 🚀
                </button>
                <div className="text-sm text-gray-400">
                  <p>Estamos aqui para te apoiar em cada passo.</p>
                  <p className="mt-2 text-xs">P.S.: Seu próximo pagamento será em {dateString}. Você pode cancelar quando quiser.</p>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const Navbar = ({ activeView, changeView, userPlan }: { activeView: AppView; changeView: (v: AppView) => void; userPlan: UserPlan }) => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-50 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm no-print">
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => changeView('dashboard')}>
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 group-hover:rotate-3 transition-transform">
        P
      </div>
      <div>
        <h1 className="text-xl font-bold text-indigo-900 tracking-tight leading-none uppercase">Prisma</h1>
        <span className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase">Ensino</span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="hidden xl:flex gap-1">
        {[
          { id: 'activities', label: 'Atividades', icon: '🎨' },
          { id: 'stories', label: 'Contos', icon: '📚' },
          { id: 'lesson-plans', label: 'Planos de Aula', icon: '📝' },
          { id: 'adjust-levels', label: 'Adaptação de Níveis', icon: '🪜' },
          { id: 'visual-materials', label: 'Materiais Visuais', icon: '🖼️' },
          { id: 'summaries', label: 'Comunicados aos Pais', icon: '🏠' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => changeView(item.id as AppView)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeView === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-indigo-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="h-6 w-px bg-gray-200 mx-2 hidden xl:block"></div>
      <button
        onClick={() => changeView('plans')}
        className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
          userPlan === 'free' ? 'bg-indigo-600 text-white' : userPlan === 'pro' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
        }`}
      >
        {userPlan === 'free' ? '💎 Assinar' : `Plano ${userPlan}`}
      </button>
    </div>
  </nav>
);

const LessonPlanForm = ({ onSubmit, loading, onBack }: { onSubmit: (p: LessonPlanParams) => void; loading: boolean; onBack: () => void }) => {
  const [params, setParams] = useState<LessonPlanParams>({ theme: '', objective: '', ageRange: '4-6 anos', estimatedTime: '1 hora' });
  const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-blue-50 bg-blue-50/30 text-blue-900 focus:bg-white focus:border-blue-400 outline-none transition-all font-medium";
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white no-print">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-black text-blue-700 flex items-center gap-3">📝 Planos de Aula</h2>
           <p className="text-gray-500 font-medium mt-2 text-sm">Crie roteiros completos de aula alinhados à BNCC</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">← Início</button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-blue-700/70 mb-2 ml-1 uppercase tracking-wider">Tema da Aula</label>
          <input placeholder="Ex: O Ciclo das Plantas" value={params.theme} onChange={(e) => setParams({...params, theme: e.target.value})} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-700/70 mb-2 ml-1 uppercase tracking-wider">Objetivo BNCC / Pedagógico</label>
          <textarea placeholder="Ex: Compreender a importância da água para o crescimento..." value={params.objective} onChange={(e) => setParams({...params, objective: e.target.value})} className={`${inputClasses} h-28`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-blue-700/70 mb-2 ml-1 uppercase tracking-wider">Faixa Etária</label>
            <input value={params.ageRange} onChange={(e) => setParams({...params, ageRange: e.target.value})} className={inputClasses} />
          </div>
          <div>
            <label className="block text-sm font-bold text-blue-700/70 mb-2 ml-1 uppercase tracking-wider">Tempo Estimado</label>
            <input value={params.estimatedTime} onChange={(e) => setParams({...params, estimatedTime: e.target.value})} className={inputClasses} />
          </div>
        </div>
        <button onClick={() => onSubmit(params)} disabled={loading || !params.theme} className="w-full py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-lg rounded-[2rem] shadow-xl flex items-center justify-center gap-2">
          {loading ? 'Estruturando plano...' : <><span>Gerar Plano Completo</span> <span className="text-2xl">📋</span></>}
        </button>
      </div>
    </div>
  );
};

const ActivityForm = ({ onSubmit, loading, onBack, userPlan, creationsToday }: { onSubmit: (p: ActivityParams) => void; loading: boolean; onBack: () => void; userPlan: UserPlan; creationsToday: number }) => {
  const [params, setParams] = useState<ActivityParams>({ age: 5, objective: '', estimatedTime: '30 min', difficulty: 'medium' });
  const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-pink-50 bg-pink-50/30 text-pink-900 focus:bg-white focus:border-pink-400 outline-none transition-all font-medium";

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white no-print">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-pink-500 flex items-center gap-3">🎨 Atividades</h2>
          <p className="text-gray-500 font-medium mt-2 text-sm">Crie exercícios pedagógicos personalizados para sua turma</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">← Início</button>
      </div>
      
      {userPlan === 'free' && (
        <div className="mb-6 bg-pink-50 p-4 rounded-2xl border border-pink-100 flex justify-between items-center">
             <span className="text-xs font-bold text-pink-800">Criações hoje: {creationsToday}/3</span>
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i <= creationsToday ? 'bg-pink-500' : 'bg-pink-200'}`}></div>)}
             </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-bold text-pink-700/70 mb-2 ml-1 uppercase tracking-wider">Idade</label>
             <input type="number" value={params.age} onChange={(e) => setParams({...params, age: parseInt(e.target.value)})} className={inputClasses} />
           </div>
           <div>
             <label className="block text-sm font-bold text-pink-700/70 mb-2 ml-1 uppercase tracking-wider">Dificuldade</label>
             <select value={params.difficulty} onChange={(e) => setParams({...params, difficulty: e.target.value as any})} className={inputClasses}>
               <option value="easy">Fácil</option>
               <option value="medium">Média</option>
               <option value="hard">Difícil</option>
             </select>
           </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-pink-700/70 mb-2 ml-1 uppercase tracking-wider">Objetivo de Aprendizagem</label>
          <textarea placeholder="Ex: Aprender a somar números até 10..." value={params.objective} onChange={(e) => setParams({...params, objective: e.target.value})} className={`${inputClasses} h-28`} />
        </div>
        <div>
           <label className="block text-sm font-bold text-pink-700/70 mb-2 ml-1 uppercase tracking-wider">Tempo Estimado</label>
           <input value={params.estimatedTime} onChange={(e) => setParams({...params, estimatedTime: e.target.value})} className={inputClasses} />
        </div>
        <button onClick={() => onSubmit(params)} disabled={loading || !params.objective} className="w-full py-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg rounded-[2rem] shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
          {loading ? 'Criando mágica...' : <><span>Gerar Atividade</span> <span className="text-2xl">✨</span></>}
        </button>
      </div>
    </div>
  );
};

const UnifiedStoryForm = ({ onSubmit, loading, onBack, userPlan, onUpgrade }: { onSubmit: (p: StoryParams) => void; loading: boolean; onBack: () => void; userPlan: UserPlan; onUpgrade: () => void }) => {
  const [params, setParams] = useState<StoryParams>({ mode: 'educational', age: 5, theme: '', message: '', charName: '', duration: 'média' });
  const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-amber-50 bg-amber-50/30 text-amber-900 focus:bg-white focus:border-amber-400 outline-none transition-all font-medium";

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white no-print">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-black text-amber-500 flex items-center gap-3">📚 Contos</h2>
           <p className="text-gray-500 font-medium mt-2 text-sm">Gere histórias infantis personalizadas com narração em áudio</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">← Início</button>
      </div>
      
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
        <button onClick={() => setParams({...params, mode: 'educational'})} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${params.mode === 'educational' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-400'}`}>Educativa</button>
        <button onClick={() => setParams({...params, mode: 'sleep'})} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${params.mode === 'sleep' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}>Para Dormir 🌙</button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-bold text-amber-700/70 mb-2 ml-1 uppercase tracking-wider">Idade</label>
             <input type="number" value={params.age} onChange={(e) => setParams({...params, age: parseInt(e.target.value)})} className={inputClasses} />
           </div>
           <div>
             <label className="block text-sm font-bold text-amber-700/70 mb-2 ml-1 uppercase tracking-wider">Tema</label>
             <input placeholder={params.mode === 'sleep' ? "Ex: Um passeio nas nuvens" : "Ex: Amizade na escola"} value={params.theme} onChange={(e) => setParams({...params, theme: e.target.value})} className={inputClasses} />
           </div>
        </div>
        
        {params.mode === 'educational' ? (
          <div>
            <label className="block text-sm font-bold text-amber-700/70 mb-2 ml-1 uppercase tracking-wider">Mensagem / Lição</label>
            <input placeholder="Ex: Importância de dividir os brinquedos" value={params.message} onChange={(e) => setParams({...params, message: e.target.value})} className={inputClasses} />
          </div>
        ) : (
           <div>
             <label className="block text-sm font-bold text-amber-700/70 mb-2 ml-1 uppercase tracking-wider">Duração</label>
             <select value={params.duration} onChange={(e) => setParams({...params, duration: e.target.value as any})} className={inputClasses}>
               <option value="curta">Curta (~3 min)</option>
               <option value="média">Média (~5 min)</option>
             </select>
           </div>
        )}

        <div>
             <div className="flex justify-between items-center mb-2 ml-1">
                 <label className="block text-sm font-bold text-amber-700/70 uppercase tracking-wider">Nome do Personagem</label>
                 {userPlan === 'free' && <span onClick={onUpgrade} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md cursor-pointer font-bold hover:bg-amber-200">💎 Recurso Pro</span>}
             </div>
             <input 
               disabled={userPlan === 'free'} 
               placeholder={userPlan === 'free' ? "Desbloqueie para personalizar" : "Ex: Maria"} 
               value={params.charName || ''} 
               onChange={(e) => setParams({...params, charName: e.target.value})} 
               className={`${inputClasses} ${userPlan === 'free' ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100' : ''}`} 
             />
        </div>

        <button onClick={() => onSubmit(params)} disabled={loading || !params.theme} className={`w-full py-5 text-white font-black text-lg rounded-[2rem] shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all ${params.mode === 'sleep' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}>
          {loading ? 'Escrevendo história...' : <><span>Gerar História</span> <span className="text-2xl">📖</span></>}
        </button>
      </div>
    </div>
  );
};

const AdjustLevelsForm = ({ onSubmit, loading, onBack }: { onSubmit: (p: ActivityAdjustmentParams) => void; loading: boolean; onBack: () => void }) => {
  const [params, setParams] = useState<ActivityAdjustmentParams>({ originalActivity: '', age: 6 });
  const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-cyan-50 bg-cyan-50/30 text-cyan-900 focus:bg-white focus:border-cyan-400 outline-none transition-all font-medium";

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white no-print">
       <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-black text-cyan-600 flex items-center gap-3">🪜 Adaptação de Níveis</h2>
           <p className="text-gray-500 font-medium mt-2 text-sm">Adapte atividades em 3 níveis: fácil, médio e difícil</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">← Início</button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-cyan-700/70 mb-2 ml-1 uppercase tracking-wider">Atividade Original</label>
          <textarea placeholder="Cole aqui a atividade que você quer adaptar..." value={params.originalActivity} onChange={(e) => setParams({...params, originalActivity: e.target.value})} className={`${inputClasses} h-40`} />
        </div>
        <div>
           <label className="block text-sm font-bold text-cyan-700/70 mb-2 ml-1 uppercase tracking-wider">Idade Alvo</label>
           <input type="number" value={params.age} onChange={(e) => setParams({...params, age: parseInt(e.target.value)})} className={inputClasses} />
        </div>
        <button onClick={() => onSubmit(params)} disabled={loading || !params.originalActivity} className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-lg rounded-[2rem] shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
          {loading ? 'Adaptando...' : <><span>Gerar 3 Níveis</span> <span className="text-2xl">📊</span></>}
        </button>
      </div>
    </div>
  );
};

const VisualMaterialForm = ({ onSubmit, loading, onBack }: { onSubmit: (p: VisualMaterialParams) => void; loading: boolean; onBack: () => void }) => {
  const [params, setParams] = useState<VisualMaterialParams>({ theme: '', age: 5, objective: '' });
  const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-purple-50 bg-purple-50/30 text-purple-900 focus:bg-white focus:border-purple-400 outline-none transition-all font-medium";

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white no-print">
       <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-black text-purple-600 flex items-center gap-3">🖼️ Materiais Visuais</h2>
           <p className="text-gray-500 font-medium mt-2 text-sm">Gere descrições de recursos visuais para suas aulas</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">← Início</button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-purple-700/70 mb-2 ml-1 uppercase tracking-wider">Tema do Material</label>
          <input placeholder="Ex: Cartazes de Emoções" value={params.theme} onChange={(e) => setParams({...params, theme: e.target.value})} className={inputClasses} />
        </div>
        <div>
           <label className="block text-sm font-bold text-purple-700/70 mb-2 ml-1 uppercase tracking-wider">Objetivo Visual</label>
           <textarea placeholder="Ex: Ajudar crianças a identificarem tristeza e alegria..." value={params.objective} onChange={(e) => setParams({...params, objective: e.target.value})} className={`${inputClasses} h-28`} />
        </div>
        <div>
           <label className="block text-sm font-bold text-purple-700/70 mb-2 ml-1 uppercase tracking-wider">Idade das Crianças</label>
           <input type="number" value={params.age} onChange={(e) => setParams({...params, age: parseInt(e.target.value)})} className={inputClasses} />
        </div>
        <button onClick={() => onSubmit(params)} disabled={loading || !params.theme} className="w-full py-5 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-black text-lg rounded-[2rem] shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
          {loading ? 'Projetando visual...' : <><span>Criar Descrição Visual</span> <span className="text-2xl">🎨</span></>}
        </button>
      </div>
    </div>
  );
};

const ParentSummaryForm = ({ onSubmit, loading, onBack }: { onSubmit: (p: ParentSummaryParams) => void; loading: boolean; onBack: () => void }) => {
  const [params, setParams] = useState<ParentSummaryParams>({ age: 4, weekWork: '', highlights: '', observations: '' });
  const inputClasses = "w-full px-5 py-4 rounded-2xl border-2 border-green-50 bg-green-50/30 text-green-900 focus:bg-white focus:border-green-400 outline-none transition-all font-medium";

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white no-print">
       <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-black text-green-600 flex items-center gap-3">🏠 Comunicados aos Pais</h2>
           <p className="text-gray-500 font-medium mt-2 text-sm">Crie mensagens e resumos semanais para as famílias</p>
        </div>
        <button onClick={onBack} className="text-xs font-bold px-4 py-2 bg-gray-100 text-gray-500 rounded-xl">← Início</button>
      </div>
      <div className="space-y-6">
        <div>
           <label className="block text-sm font-bold text-green-700/70 mb-2 ml-1 uppercase tracking-wider">Idade da Criança</label>
           <input type="number" value={params.age} onChange={(e) => setParams({...params, age: parseInt(e.target.value)})} className={inputClasses} />
        </div>
        <div>
          <label className="block text-sm font-bold text-green-700/70 mb-2 ml-1 uppercase tracking-wider">O que foi trabalhado?</label>
          <textarea placeholder="Ex: Cores primárias e coordenação motora fina..." value={params.weekWork} onChange={(e) => setParams({...params, weekWork: e.target.value})} className={`${inputClasses} h-24`} />
        </div>
        <div>
          <label className="block text-sm font-bold text-green-700/70 mb-2 ml-1 uppercase tracking-wider">Destaques da Criança/Turma</label>
          <textarea placeholder="Ex: Joãozinho conseguiu segurar o lápis corretamente..." value={params.highlights} onChange={(e) => setParams({...params, highlights: e.target.value})} className={`${inputClasses} h-24`} />
        </div>
        <button onClick={() => onSubmit(params)} disabled={loading || !params.weekWork} className="w-full py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-lg rounded-[2rem] shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
          {loading ? 'Escrevendo resumo...' : <><span>Gerar Comunicado</span> <span className="text-2xl">💌</span></>}
        </button>
      </div>
    </div>
  );
};

const PlansView = ({ onBack, onSubscribePro, onSubscribePremium }: { onBack: () => void; onSubscribePro: () => void; onSubscribePremium: () => void }) => (
  <div className="max-w-6xl mx-auto py-12 px-6 animate-fadeIn">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-black text-indigo-900 mb-4">Escolha o Prisma ideal para você</h2>
      <p className="text-lg text-indigo-900/60 font-medium">Soluções flexíveis para apoiar sua prática pedagógica em qualquer escala.</p>
    </div>
    <div className="grid md:grid-cols-3 gap-8 items-stretch mb-20">
      
      {/* FREE */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm flex flex-col hover:border-indigo-100 transition-all">
        <div className="text-4xl mb-6">🌱</div>
        <h3 className="text-2xl font-black text-indigo-900 leading-tight mb-2">Plano Free</h3>
        <p className="text-indigo-900 font-black text-xl mb-4">Grátis</p>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-8">PARA COMEÇAR SEM COMPROMISSO</p>
        <ul className="space-y-4 mb-8 flex-grow">
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span><strong>3 criações por dia</strong> (atividades, contos, historinhas)</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>Testar recursos básicos da plataforma</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>Conhecer a metodologia PRISMA</span></li>
          <li className="text-sm text-amber-600 font-medium flex gap-2">⚠️ <span>Com marca d'água "Criado com PRISMA ENSINO"</span></li>
          <li className="text-sm text-amber-600 font-medium flex gap-2">⚠️ <span>Sem áudio</span></li>
          <li className="text-sm text-amber-600 font-medium flex gap-2">⚠️ <span>Sem download em PDF</span></li>
          <li className="text-sm text-gray-400 italic mt-4">💡 Perfeito para experimentar no dia a dia</li>
        </ul>
        <div className="pt-6 border-t border-gray-50 text-center">
           <p className="text-indigo-900/40 text-sm font-bold mb-4">🎁 Grátis para sempre</p>
          <button onClick={onBack} className="w-full py-4 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all">👉 Começar agora</button>
        </div>
      </div>
      
      {/* PRO */}
      <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 flex flex-col transform md:scale-105 relative overflow-hidden ring-4 ring-indigo-100 z-10">
        <div className="absolute top-4 right-4 bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">⭐ Mais Popular</div>
        <div className="text-4xl mb-6">🚀</div>
        <h3 className="text-2xl font-black text-white leading-tight mb-2">Plano Pro</h3>
        <p className="text-white font-black text-xl mb-4">R$ 29,90 <span className="text-sm opacity-80 font-medium">/mês</span></p>
        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-8">PARA PROFESSORES QUE QUEREM GANHAR TEMPO</p>
        <ul className="space-y-3 mb-8 flex-grow">
          <li className="text-sm text-white font-medium flex gap-2">✅ <span><strong>300 criações por mês</strong> (atividades, contos, planos, materiais)</span></li>
          <li className="text-sm text-white font-medium flex gap-2">✅ <span><strong>100 narrações em áudio</strong> por mês (voz humana e suave)</span></li>
          <li className="text-sm text-white font-medium flex gap-2">✅ <span>Ajuste automático de nível por idade</span></li>
          <li className="text-sm text-white font-medium flex gap-2">✅ <span>Planos de aula completos alinhados à BNCC</span></li>
          <li className="text-sm text-white font-medium flex gap-2">✅ <span>Contos personalizados com nome da criança</span></li>
          <li className="text-sm text-white font-medium flex gap-2">✅ <span>Orientações personalizadas para pais</span></li>
          <li className="text-sm text-white font-medium flex gap-2">✅ <span>Download em PDF sem marca d'água</span></li>
          <li className="text-sm text-indigo-100 italic mt-4">💡 Economize 10+ horas de planejamento toda semana</li>
        </ul>
        <div className="pt-6 border-t border-white/20 text-white text-center">
          <div className="mb-6">
             <p className="font-bold text-sm">ou R$ 249/ano</p>
             <p className="text-[10px] text-indigo-200 uppercase tracking-widest">(economize R$ 110 - mais de 3 meses grátis!)</p>
          </div>
          <button onClick={onSubscribePro} className="w-full py-4 rounded-xl bg-white text-indigo-600 font-bold hover:shadow-lg hover:scale-[1.02] transition-all">👉 Ativar Plano Pro</button>
        </div>
      </div>

      {/* PREMIUM */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-purple-50 shadow-sm flex flex-col hover:border-purple-100 transition-all">
        <div className="text-4xl mb-6">💜</div>
        <h3 className="text-2xl font-black text-purple-900 leading-tight mb-2">Plano Premium</h3>
        <p className="text-purple-900 font-black text-xl mb-4">R$ 149 <span className="text-sm opacity-60 font-medium">/mês</span></p>
        <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-8">PARA ESCOLAS E CURSINHOS</p>
        <ul className="space-y-3 mb-8 flex-grow">
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>Todos os recursos do Plano Pro</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span><strong>1.000 criações por mês</strong> (equipe pedagógica)</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span><strong>300 narrações em áudio</strong> por mês</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>Uso institucional (Escola ou Cursinho)</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>10 contas de professor incluídas</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>Organização e padronização de materiais</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>Gestão centralizada (coordenador vê tudo)</span></li>
          <li className="text-sm text-gray-600 font-medium flex gap-2">✅ <span>Suporte prioritário</span></li>
          <li className="text-sm text-purple-600 italic mt-4">💡 Padronize o ensino e economize tempo de toda a equipe</li>
        </ul>
        <div className="pt-6 border-t border-gray-50 text-center">
          <p className="text-purple-900/40 text-sm font-bold mb-4">por escola</p>
          <button onClick={onSubscribePremium} className="w-full py-4 rounded-xl border-2 border-purple-600 text-purple-600 font-bold hover:bg-purple-50 transition-all">👉 Conhecer Plano Premium</button>
        </div>
      </div>
    </div>

    {/* FAQ SECTION */}
    <div className="mt-20 max-w-4xl mx-auto">
      <h3 className="text-3xl font-black text-indigo-900 text-center mb-12 flex items-center justify-center gap-3">
        <span>❓</span> Perguntas Frequentes
      </h3>
      <div className="space-y-6">
        {[
          {
            q: 'O que conta como "criação"?',
            a: 'Cada atividade, conto, plano de aula, material visual ou comunicado para pais conta como 1 criação. No Plano Pro você tem 300/mês, o que dá ~10 por dia.'
          },
          {
            q: 'E se eu precisar de mais criações no mês?',
            a: (
              <>
                Você pode comprar pacotes extras:<br/>
                • +100 criações = R$ 14,90<br/>
                • +200 criações = R$ 24,90<br/>
                <br/>
                Ou fazer upgrade para o Plano Premium (1.000 criações/mês)
              </>
            )
          },
          {
             q: 'As narrações em áudio são naturais?',
             a: 'Sim! Usamos vozes de IA de última geração que soam humanas, suaves e acolhedoras. Perfeitas para contos de ninar e histórias educativas.'
          },
          {
             q: 'Tudo está alinhado à BNCC?',
             a: 'Sim! Todos os planos de aula e atividades são criados com base na Base Nacional Comum Curricular. Você pode usar tranquilamente nas suas aulas e apresentar para coordenação.'
          },
          {
             q: 'Posso personalizar os contos com o nome da criança?',
             a: 'Sim! No Plano Pro e Premium você pode criar contos personalizados com o nome da criança, tornando a história ainda mais especial.'
          },
          {
             q: 'Como funciona o Plano Premium para escolas?',
             a: 'O Plano Premium inclui 10 contas de professor e 1 conta de coordenador. O coordenador tem acesso a todos os materiais criados pela equipe e pode gerar relatórios de uso. Ideal para padronização pedagógica.'
          },
          {
             q: 'Posso cancelar a qualquer momento?',
             a: 'Sim! Não há fidelidade. Você pode cancelar quando quiser e continua tendo acesso até o fim do período pago.'
          },
          {
             q: 'Tem desconto no plano anual?',
             a: 'Sim! O Plano Pro anual sai por R$ 249/ano (equivalente a R$ 20,75/mês), economizando R$ 110 em relação ao plano mensal. É como ganhar mais de 3 meses grátis!'
          }
        ].map((faq, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border-2 border-indigo-50 hover:border-indigo-100 transition-all shadow-sm">
            <h4 className="text-xl font-black text-indigo-900 mb-3 flex items-start gap-3">
              <span className="text-indigo-500">P:</span> {faq.q}
            </h4>
            <p className="text-gray-600 font-medium leading-relaxed pl-8 border-l-4 border-indigo-100 ml-1">
              <span className="font-bold text-indigo-400 mr-2">R:</span> {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* FAIR USE POLICY */}
    <div className="mt-20 max-w-4xl mx-auto bg-indigo-50/30 p-10 rounded-[3rem] border border-indigo-50/50">
      <h3 className="text-3xl font-black text-indigo-900 text-center mb-12 flex items-center justify-center gap-3 uppercase tracking-wider">
        <span>📋</span> Política de Uso Justo
      </h3>
      <div className="space-y-8 text-gray-600 font-medium text-lg leading-relaxed">
        <p className="text-center max-w-2xl mx-auto">
          O PRISMA ENSINO foi criado para apoiar professores no dia a dia pedagógico.
          Os limites de criação foram estabelecidos para garantir um uso saudável e sustentável da plataforma:
        </p>

        <div className="bg-white p-8 rounded-[2rem] border border-indigo-50 shadow-sm">
           <ul className="space-y-3">
             <li className="flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
               <span><strong>Plano Free:</strong> 3 criações/dia (90/mês)</span>
             </li>
             <li className="flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
               <span><strong>Plano Pro:</strong> 300 criações/mês + 100 áudios/mês</span>
             </li>
             <li className="flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-purple-600"></span>
               <span><strong>Plano Premium:</strong> 1.000 criações/mês + 300 áudios/mês</span>
             </li>
           </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
             <h4 className="font-black text-red-800 mb-4 flex items-center gap-2">🚫 NÃO É PERMITIDO</h4>
             <ul className="space-y-3 text-sm text-red-900/80">
                <li className="flex gap-2"><span>•</span> Revender ou redistribuir conteúdo criado pela plataforma</li>
                <li className="flex gap-2"><span>•</span> Usar bots ou automações para gerar conteúdo em massa</li>
                <li className="flex gap-2"><span>•</span> Compartilhar login com outras pessoas (cada professor deve ter sua conta)</li>
                <li className="flex gap-2"><span>•</span> Uso comercial sem autorização (ex: vender apostilas geradas pelo PRISMA)</li>
             </ul>
           </div>
           <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100">
             <h4 className="font-black text-green-800 mb-4 flex items-center gap-2">✅ É PERMITIDO</h4>
             <ul className="space-y-3 text-sm text-green-900/80">
                <li className="flex gap-2"><span>•</span> Usar todo o conteúdo gerado nas suas aulas</li>
                <li className="flex gap-2"><span>•</span> Compartilhar com seus alunos e suas famílias</li>
                <li className="flex gap-2"><span>•</span> Adaptar e personalizar os materiais gerados</li>
                <li className="flex gap-2"><span>•</span> Imprimir e distribuir para sua turma</li>
             </ul>
           </div>
        </div>

        <div className="text-center pt-8 border-t border-indigo-100">
           <p className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wide">⚠️ Atenção</p>
           <p className="text-sm text-gray-500 mb-4">Em caso de uso suspeito ou abusivo, a conta pode ser suspensa.</p>
           <p className="font-bold text-indigo-900">
             Dúvidas? <a href="mailto:suporte@prismaensino.com.br" className="text-indigo-600 underline">suporte@prismaensino.com.br</a>
           </p>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [view, setView] = useState<AppView>('dashboard');
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [creationsToday, setCreationsToday] = useState(0);
  const [creationsMonth, setCreationsMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyMode, setStoryMode] = useState<'educational' | 'sleep'>('educational');
  const [limitReached, setLimitReached] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem('prisma_user_plan') as UserPlan;
    if (savedPlan) setUserPlan(savedPlan);
    const count = parseInt(localStorage.getItem('prisma_creations_today') || '0');
    setCreationsToday(count);
    const monthCount = parseInt(localStorage.getItem('prisma_creations_month') || '0');
    setCreationsMonth(monthCount);
  }, []);

  const changeView = (newView: AppView) => {
    handleStopAudio();
    setResult(null); 
    setLoading(false);
    setLimitReached(false);
    setShowLimitWarning(false);
    setView(newView);
  };

  const checkAccess = (v: AppView): boolean => {
    if (userPlan === 'premium' || userPlan === 'pro') return true;
    
    // Features blocked for FREE plan
    const proFeatures: AppView[] = ['lesson-plans', 'adjust-levels', 'visual-materials', 'summaries'];
    if (proFeatures.includes(v)) return false;
    
    return true;
  };

  const handleGenerateContent = async (type: string, params: any) => {
    if (userPlan === 'free' && creationsToday >= 3) {
      setLimitReached(true);
      return;
    }

    setLoading(true);
    setResult(null);
    handleStopAudio();
    if (type === 'story') setStoryMode(params.mode);
    try {
      let text = '';
      if (type === 'activity') text = await geminiService.generateActivity(params);
      else if (type === 'story') text = await geminiService.generateStory(params);
      else if (type === 'lesson-plan') text = await geminiService.generateLessonPlan(params);
      else if (type === 'adjust-levels') text = await geminiService.adjustActivityLevels(params);
      else if (type === 'visual-material') text = await geminiService.generateVisualMaterial(params);
      else if (type === 'summary') text = await geminiService.generateParentSummary(params);
      
      setResult(text);
      
      // Update counters
      if (userPlan === 'free') {
        const nextCount = creationsToday + 1;
        setCreationsToday(nextCount);
        localStorage.setItem('prisma_creations_today', nextCount.toString());
      } else if (userPlan === 'pro' || userPlan === 'premium') {
         const nextMonth = creationsMonth + 1;
         setCreationsMonth(nextMonth);
         localStorage.setItem('prisma_creations_month', nextMonth.toString());
         
         // Trigger 80% limit warning for PRO users (240 of 300)
         if (userPlan === 'pro' && nextMonth === 240) {
            setShowLimitWarning(true);
         }
      }
    } catch (error) {
      console.error(error);
      alert('Tivemos um problema. Vamos tentar de novo?');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (userPlan === 'free') {
        alert("O recurso de áudio é exclusivo dos Planos Pro e Premium.");
        return;
    }
    if (!result || isAudioLoading) return;
    if (isPlaying) { handleStopAudio(); return; }
    setIsAudioLoading(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const isSleepy = view === 'stories' && storyMode === 'sleep';
      const buffer = await geminiService.getAudioBuffer(result, audioContextRef.current, true, isSleepy);
      if (buffer) {
        handleStopAudio();
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => { setIsPlaying(false); audioSourceRef.current = null; };
        audioSourceRef.current = source;
        source.start(0);
        setIsPlaying(true);
      }
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleStopAudio = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const renderView = () => {
    if (view === 'dashboard') {
      return (
        <div className="max-w-7xl mx-auto py-16 px-6 animate-fadeIn">
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-black text-indigo-900 mb-6 italic">Educação com <span className="text-indigo-600">Coração</span></h2>
            <p className="text-xl text-indigo-900/60 font-medium">Escolha uma ferramenta para apoiar sua aula hoje.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[
              { title: 'Atividades', icon: '🎨', view: 'activities', color: 'bg-pink-50 text-pink-700' },
              { title: 'Contos', icon: '📚', view: 'stories', color: 'bg-amber-50 text-amber-700' },
              { title: 'Planos de Aula', icon: '📝', view: 'lesson-plans', color: 'bg-blue-50 text-blue-700' },
              { title: 'Adaptação de Níveis', icon: '🪜', view: 'adjust-levels', color: 'bg-cyan-50 text-cyan-700' },
              { title: 'Materiais Visuais', icon: '🖼️', view: 'visual-materials', color: 'bg-purple-50 text-purple-700' },
              { title: 'Comunicados aos Pais', icon: '🏠', view: 'summaries', color: 'bg-green-50 text-green-700' },
            ].map((card, i) => (
              <button 
                key={i} 
                onClick={() => changeView(card.view as AppView)} 
                className={`${card.color} p-6 rounded-[2rem] text-left hover:scale-[1.05] transition-all border-2 border-transparent hover:border-white shadow-sm relative group`}
              >
                {!checkAccess(card.view as AppView) && <span className="absolute top-4 right-4 text-xs opacity-40">🔒</span>}
                <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">{card.icon}</span>
                <h3 className="text-sm font-black leading-tight uppercase tracking-wider">{card.title}</h3>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (view === 'welcome-pro') return <WelcomeProView onStart={() => setView('dashboard')} />;
    if (view === 'plans') return <PlansView onBack={() => setView('dashboard')} onSubscribePro={() => { setUserPlan('pro'); localStorage.setItem('prisma_user_plan', 'pro'); setView('welcome-pro'); }} onSubscribePremium={() => { setUserPlan('premium'); localStorage.setItem('prisma_user_plan', 'premium'); setView('dashboard'); }} />;
    if (limitReached) return <LimitReached onUpgrade={() => setView('plans')} onBack={() => setView('dashboard')} />;
    if (!checkAccess(view)) return <Paywall feature={view === 'summaries' ? 'Comunicados aos Pais' : view === 'lesson-plans' ? 'Planos de Aula' : 'Recursos Avançados'} onUpgrade={() => setView('plans')} onBack={() => setView('dashboard')} />;

    const isSleepModeInView = view === 'stories' && storyMode === 'sleep' && result;

    return (
      <div className="max-w-7xl mx-auto py-12 px-6 grid lg:grid-cols-2 gap-12 items-start">
        {showLimitWarning && <ProLimitWarning onClose={() => setShowLimitWarning(false)} onUpgradePremium={() => { setShowLimitWarning(false); setView('plans'); }} />}
        <div className="no-print">
          {view === 'activities' && <ActivityForm onSubmit={(p) => handleGenerateContent('activity', p)} loading={loading} onBack={() => setView('dashboard')} userPlan={userPlan} creationsToday={creationsToday} />}
          {view === 'stories' && <UnifiedStoryForm onSubmit={(p) => handleGenerateContent('story', p)} loading={loading} onBack={() => setView('dashboard')} userPlan={userPlan} onUpgrade={() => setView('plans')} />}
          {view === 'lesson-plans' && <LessonPlanForm onSubmit={(p) => handleGenerateContent('lesson-plan', p)} loading={loading} onBack={() => setView('dashboard')} />}
          {view === 'adjust-levels' && <AdjustLevelsForm onSubmit={(p) => handleGenerateContent('adjust-levels', p)} loading={loading} onBack={() => setView('dashboard')} />}
          {view === 'visual-materials' && <VisualMaterialForm onSubmit={(p) => handleGenerateContent('visual-material', p)} loading={loading} onBack={() => setView('dashboard')} />}
          {view === 'summaries' && <ParentSummaryForm onSubmit={(p) => handleGenerateContent('summary', p)} loading={loading} onBack={() => setView('dashboard')} />}
        </div>
        <div className="space-y-6 lg:sticky lg:top-28">
           <div className={`p-10 rounded-[3rem] shadow-xl border min-h-[500px] relative flex flex-col transition-all duration-700 ${isSleepModeInView ? 'bg-[#0A0D1E] text-indigo-100 border-indigo-900' : 'bg-white border-white'}`}>
              {!result && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center p-8">
                  <span className="text-7xl mb-4">✨</span>
                  <p className="font-bold text-lg">Pronto para criar?</p>
                </div>
              )}
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-[3rem]">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 font-black text-indigo-600 animate-pulse uppercase tracking-[0.2em] text-[10px]">Prisma criando...</p>
                </div>
              )}
              {result && (
                <div className="animate-fadeIn">
                  <div className={`flex justify-between items-center mb-8 p-4 rounded-2xl border ${isSleepModeInView ? 'bg-indigo-900/50 border-indigo-800' : 'bg-indigo-50/50 border-indigo-100'}`}>
                    <h3 className="font-black text-xs uppercase tracking-widest">{view === 'summaries' ? 'Comunicados aos Pais' : view === 'lesson-plans' ? 'Planos de Aula' : view === 'adjust-levels' ? 'Adaptação de Níveis' : view === 'visual-materials' ? 'Materiais Visuais' : view === 'stories' ? 'Contos' : 'Atividades'}</h3>
                    <div className="flex gap-2">
                       {/* Audio button is completely hidden/disabled for FREE users */}
                       {userPlan !== 'free' ? (
                           <button onClick={handlePlayAudio} className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-md flex items-center gap-2 ${isPlaying ? 'bg-red-500' : 'bg-green-600'}`}>
                             {isAudioLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isPlaying ? '⏹️ Parar' : '🔊 Ouvir Narração')}
                           </button>
                       ) : (
                           <button onClick={() => setView('plans')} className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-400 font-bold flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                             🔒 Ouvir
                           </button>
                       )}
                    </div>
                  </div>
                  <div className={`whitespace-pre-wrap leading-relaxed font-medium text-lg p-8 rounded-[2rem] border-2 shadow-inner relative overflow-hidden ${isSleepModeInView ? 'bg-indigo-950/50 border-indigo-800 text-indigo-100' : 'bg-orange-50/30 border-orange-100 text-indigo-950'}`}>
                    {result}
                    {userPlan === 'free' && (
                        <div className="absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-widest text-indigo-900/20 pointer-events-none select-none">
                            Criado com PRISMA ENSINO
                        </div>
                    )}
                  </div>

                  {view === 'lesson-plans' && <BNCCExplanation />}

                  {userPlan !== 'free' && (
                    <div className="mt-10 flex justify-center no-print">
                      <button onClick={() => window.print()} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-lg flex items-center gap-2">🖨️ PDF / Imprimir</button>
                    </div>
                  )}
                  {userPlan === 'free' && (
                    <div className="mt-8 text-center no-print p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                       <p className="text-xs font-bold text-indigo-600 mb-2">💡 Você está no Plano Free</p>
                       <p className="text-xs text-gray-500 mb-4">PDF e Áudio são recursos Pro.</p>
                       <button onClick={() => setView('plans')} className="text-indigo-900 font-black text-xs underline">Ativar Plano Pro</button>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <Navbar activeView={view} changeView={changeView} userPlan={userPlan} />
      {renderView()}
    </div>
  );
}