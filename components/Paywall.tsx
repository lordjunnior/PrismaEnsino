interface PaywallProps {
  feature: string;
  onUpgrade: () => void;
  onBack: () => void;
}

export default function Paywall({ feature, onUpgrade, onBack }: PaywallProps) {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-center animate-fadeIn">
      <span className="text-8xl mb-6 block">🔒</span>
      <h2 className="text-4xl font-black text-indigo-900 mb-4">
        {feature} é exclusivo do Plano Pro
      </h2>
      <p className="text-xl text-indigo-900/60 mb-12">
        Faça upgrade para acessar todos os recursos avançados do PRISMA ENSINO
      </p>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
        >
          Voltar
        </button>
        <button 
          onClick={onUpgrade}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg"
        >
          Ver Planos ✨
        </button>
      </div>
    </div>
  );
}
