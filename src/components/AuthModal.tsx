import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, UserCheck, X, LogIn, UserPlus, LogOut, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, register, logout, quickSwitchToDemo, theme } = useAuth();
  const isLight = theme === 'light';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (mode === 'login') {
      const res = await login(username, password);
      setIsSubmitting(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Erro ao realizar login.');
      }
    } else {
      const res = await register(username, password, name, email);
      setIsSubmitting(false);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Erro ao registrar usuário.');
      }
    }
  };

  const handleQuickSwitch = async (uname: string) => {
    setErrorMsg('');
    setIsSubmitting(true);
    await quickSwitchToDemo(uname);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className={`border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
      }`}>
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-zinc-950/60 border-zinc-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-600/20 text-indigo-400'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Autenticação de Usuário</h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Cada usuário possui sua rotina e fichas privadas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current user card if logged in */}
        {user && (
          <div className={`p-4 mx-5 mt-4 rounded-2xl border flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-zinc-950/80 border-zinc-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                {user.name?.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div>
                <div className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span>{user.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>@{user.username}</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setErrorMsg('Desconectado. Faça login para continuar.');
              }}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        )}

        {/* Quick Demo Switchers */}
        <div className="p-5 pb-2">
          <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Acesso Rápido com 1-Clique:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickSwitch('gbcosta')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                user?.username === 'gbcosta'
                  ? isLight
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-400'
                    : 'bg-indigo-950/40 border-indigo-600 text-white shadow-sm'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="text-xs font-bold">GB Costa</div>
              <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Plano Oficial (CrossFit + Musc)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSwitch('demo')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                user?.username === 'demo'
                  ? isLight
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-1 ring-indigo-400'
                    : 'bg-indigo-950/40 border-indigo-600 text-white shadow-sm'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="text-xs font-bold">Usuário Demo</div>
              <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Conta de Teste Alternativa</div>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3">
          <div className={`grid grid-cols-2 p-1 rounded-xl border text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-950 border-zinc-800'
          }`}>
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-zinc-800 text-white shadow-sm'
                  : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Entrar
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? isLight ? 'bg-white text-slate-900 shadow-sm' : 'bg-zinc-800 text-white shadow-sm'
                  : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Criar Conta
            </button>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Nome Completo</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Nome de Usuário (Login)</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                required
                placeholder="Ex.: gabriel, maria, gbcosta"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full border rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                }`}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>E-mail (opcional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block font-medium mb-1 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 ${
                  isLight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500'
                }`}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Processando...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar na Conta</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Registrar e Começar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
