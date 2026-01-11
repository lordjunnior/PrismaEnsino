interface WelcomeProViewProps {
  onStart: () => void;
}

export default function WelcomeProView({ onStart }: WelcomeProViewProps) {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center animate-fadeIn">
      <div className="mb-12">
        <span className="text-8xl mb-6 block animate-bounce">🎉</span>
        <h2 className="text-6xl font-black text-indigo-900 mb-6">
          Bem-vinda ao <span className="text-indigo-600">Plano Pro!</span>
        </h2>
        <p className="text-2xl text-indigo-900/60 mb-12">
          Agora você tem acesso ilimitado a todos os recursos do PRISMA ENSINO
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-indigo-50 p-8 rounded-3xl">
          <span className="text-4xl mb-4 block">📝</span>
          <h3 className="font-black text-indigo-900 text-xl mb-2">300 Criações/Mês</h3>
          <p className="text-indigo-600">Atividades, contos e planos de aula ilimitados</p>
        </div>
        <div className="bg-purple-50 p-8 rounded-3xl">
          <span className="text-4xl mb-4 block">🔊</span>
          <h3 className="font-black text-purple-900 text-xl mb-2">100 Narrações</h3>
          <p className="text-purple-600">Áudios profissionais em voz humana</p>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-xl"
      >
        Começar a Criar! 🚀
      </button>
    </div>
  );
}
