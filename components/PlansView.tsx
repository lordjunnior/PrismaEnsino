interface PlansViewProps {
  onBack: () => void;
  onSubscribePro: () => void;
  onSubscribePremium: () => void;
}

export default function PlansView({ onBack, onSubscribePro, onSubscribePremium }: PlansViewProps) {
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 animate-fadeIn">
      <button onClick={onBack} className="mb-8 text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-2">
        ← Voltar
      </button>

      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-indigo-900 mb-4">Escolha seu plano</h2>
        <p className="text-xl text-indigo-900/60">Soluções flexíveis para apoiar sua prática pedagógica</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* FREE */}
        <div className="bg-gray-50 p-8 rounded-3xl border-2 border-gray-200">
          <div className="text-center mb-6">
            <span className="text-4xl mb-4 block">🌱</span>
            <h3 className="text-2xl font-black text-gray-900 mb-2">FREE</h3>
            <p className="text-gray-600 text-sm">Para começar sem compromisso</p>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-black text-gray-900">R$ 0</p>
          </div>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>3 criações por dia</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Recursos básicos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">✗</span>
              <span className="text-gray-400">Sem áudio</span>
            </li>
          </ul>
          <button className="w-full py-3 bg-gray-200 text-gray-600 font-bold rounded-xl cursor-default">
            Plano Atual
          </button>
        </div>

        {/* PRO */}
        <div className="bg-indigo-600 p-8 rounded-3xl border-2 border-indigo-700 relative transform scale-105 shadow-2xl">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-black">
            MAIS POPULAR
          </div>
          <div className="text-center mb-6">
            <span className="text-4xl mb-4 block">🚀</span>
            <h3 className="text-2xl font-black text-white mb-2">PRO</h3>
            <p className="text-indigo-200 text-sm">Para professores produtivos</p>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-black text-white">R$ 29,90</p>
            <p className="text-indigo-200 text-sm">por mês</p>
          </div>
          <ul className="space-y-3 mb-8 text-sm text-white">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>300 criações/mês</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>100 narrações em áudio</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Todos os recursos</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>7 dias grátis</span>
            </li>
          </ul>
          <a 
            href="https://buy.stripe.com/9B67sM7MJ1I1d630nR8EM00"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-white text-indigo-600 font-black rounded-xl hover:scale-105 transition-all text-center"
          >
            Assinar Pro
          </a>
        </div>

        {/* PREMIUM */}
        <div className="bg-purple-50 p-8 rounded-3xl border-2 border-purple-200">
          <div className="text-center mb-6">
            <span className="text-4xl mb-4 block">💜</span>
            <h3 className="text-2xl font-black text-purple-900 mb-2">PREMIUM</h3>
            <p className="text-purple-600 text-sm">Para escolas e cursinhos</p>
          </div>
          <div className="mb-6">
            <p className="text-4xl font-black text-purple-900">R$ 149</p>
            <p className="text-purple-600 text-sm">por mês</p>
          </div>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>1.000 criações/mês</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>300 narrações em áudio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>Até 10 contas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>Gestão centralizada</span>
            </li>
          </ul>
          <a 
            href="https://buy.stripe.com/cNieVe5EBcmF6HF7Qj8EM02"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-purple-600 text-white font-black rounded-xl hover:scale-105 transition-all text-center"
          >
            Assinar Premium
          </a>
        </div>
      </div>
    </div>
  );
}
