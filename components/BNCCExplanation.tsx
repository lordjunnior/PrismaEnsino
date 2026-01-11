import { useState } from 'react';

export default function BNCCExplanation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 bg-blue-50 rounded-2xl border border-blue-100 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-blue-100 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📘</span>
          <h3 className="font-black text-blue-900">Entenda os códigos BNCC</h3>
        </div>
        <span className="text-blue-600 font-bold">{isOpen ? '−' : '+'}</span>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 text-sm text-blue-900 space-y-4 animate-fadeIn">
          <p>Os códigos como <strong>"EF02LP09"</strong> seguem este padrão:</p>
          <ul className="space-y-2 ml-4">
            <li><strong>• EF</strong> = Ensino Fundamental</li>
            <li><strong>• 02</strong> = Ano escolar (2º ano)</li>
            <li><strong>• LP</strong> = Componente curricular (Língua Portuguesa)</li>
            <li><strong>• 09</strong> = Número da habilidade específica</li>
          </ul>
          <p className="bg-white p-4 rounded-xl border border-blue-200">
            <strong>Exemplo prático:</strong><br/>
            <span className="text-indigo-600 font-mono">EF02LP09</span> = Habilidade 09 de Língua Portuguesa do 2º ano do Ensino Fundamental
          </p>
          <p className="text-xs text-blue-600">
            💡 <strong>Por que isso é importante?</strong><br/>
            Esses códigos são obrigatórios em documentações pedagógicas e facilitam o alinhamento com a Base Nacional Comum Curricular (BNCC).
          </p>
        </div>
      )}
    </div>
  );
}
