type AppView = 'dashboard' | 'activities' | 'stories' | 'lesson-plans' | 'adjust-levels' | 'visual-materials' | 'summaries' | 'plans' | 'welcome-pro';
type UserPlan = 'free' | 'pro' | 'premium';

interface NavbarProps {
  activeView: AppView;
  changeView: (view: AppView) => void;
  userPlan: UserPlan;
}

export default function Navbar({ activeView, changeView, userPlan }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => changeView('dashboard')} className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">P</div>
          <div className="text-left">
            <h1 className="font-black text-indigo-900 text-xl leading-none">PRISMA</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">ENSINO</p>
          </div>
        </button>

        <div className="flex items-center gap-4">
          {userPlan !== 'premium' && (
            <button 
              onClick={() => changeView('plans')} 
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl hover:scale-105 transition-all shadow-md text-sm"
            >
              {userPlan === 'free' ? '✨ PLANO PRO' : '⬆️ PLANO PREMIUM'}
            </button>
          )}
          {userPlan === 'premium' && (
            <span className="px-6 py-3 bg-purple-100 text-purple-700 font-black rounded-xl text-sm">
              👑 PREMIUM
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
