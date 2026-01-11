interface ProLimitWarningProps {
  onClose: () => void;
  onUpgradePremium: () => void;
}

export default function ProLimitWarning({ onClose, onUpgradePremium }: ProLimitWarningProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md animate-fadeIn shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h3 className="text-2xl font-black text-indigo-900 mb-2">
            Você está chegando no limite!
          </h3>
          <p className="text-indigo-600">
            Você já usou 240 das suas 300 criações mensais. Considere fazer upgrade para o Plano Premium!
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
          >
            Entendi
          </button>
          <button 
            onClick={onUpgradePremium}
            className="flex-1 py-3 bg-purple-600 text-white font-black rounded-xl hover:scale-105 transition-all"
          >
            Ver Premium
          </button>
        </div>
      </div>
    </div>
  );
}
