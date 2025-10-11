/**
 * Modal de autenticación con Supabase
 * Login y Registro en un solo componente
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useSupabase();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'reset') {
        // Modo recuperar contraseña
        const { error: resetError } = await resetPassword(email);
        if (resetError) {
          setError(resetError);
        } else {
          setSuccess('📧 Email de recuperación enviado. Revisa tu bandeja de entrada.');
          setEmail('');
          // Volver a login después de 3 segundos
          setTimeout(() => {
            setMode('signin');
            setSuccess('');
          }, 3000);
        }
      } else if (mode === 'signup') {
        // Validar contraseñas
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setLoading(false);
          return;
        }

        // Debug: Verificar qué email se está enviando
        console.log('🔍 Registrando con email:', email);
        
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError);
        } else {
          console.log('✅ Registro exitoso para:', email);
          onClose(); // Cerrar modal
          navigate('/welcome'); // Redirigir a página de bienvenida
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError);
        } else {
          onClose(); // Cerrar modal si todo salió bien
        }
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-purple-900/90 to-blue-900/90 p-8 shadow-2xl">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Cerrar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            {mode === 'signin' && '🔐 Iniciar Sesión'}
            {mode === 'signup' && '📝 Crear Cuenta'}
            {mode === 'reset' && '🔑 Recuperar Contraseña'}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            {mode === 'signin' && 'Accede a tus cartas guardadas en la nube'}
            {mode === 'signup' && 'Crea tu cuenta para sincronizar tus cartas'}
            {mode === 'reset' && 'Te enviaremos un email para restablecer tu contraseña'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-white/90">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="tu@email.com"
            />
          </div>

          {/* Contraseña (solo en signin y signup) */}
          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-white/90">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Confirmar contraseña (solo en signup) */}
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-white/90"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-3 text-sm text-green-200">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && 'Procesando...'}
            {!loading && mode === 'signin' && 'Iniciar Sesión'}
            {!loading && mode === 'signup' && 'Crear Cuenta'}
            {!loading && mode === 'reset' && 'Enviar Email'}
          </button>
        </form>

        {/* Enlaces */}
        <div className="mt-6 space-y-3 text-center">
          {/* Olvidé mi contraseña (solo en signin) */}
          {mode === 'signin' && (
            <button
              onClick={() => {
                setMode('reset');
                setError('');
                setSuccess('');
              }}
              className="block w-full text-sm text-white/60 transition-colors hover:text-white"
            >
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {/* Toggle entre signin/signup/reset */}
          <button
            onClick={() => {
              if (mode === 'reset') {
                setMode('signin');
              } else {
                toggleMode();
              }
            }}
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            {mode === 'signin' && (
              <>
                ¿No tienes cuenta? <span className="font-semibold text-purple-300">Regístrate</span>
              </>
            )}
            {mode === 'signup' && (
              <>
                ¿Ya tienes cuenta? <span className="font-semibold text-purple-300">Inicia sesión</span>
              </>
            )}
            {mode === 'reset' && (
              <>
                <span className="font-semibold text-purple-300">← Volver al inicio</span>
              </>
            )}
          </button>
        </div>

        {/* Info adicional */}
        <div className="mt-6 rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
          <p className="text-xs text-blue-200">
            ☁️ Tus cartas se sincronizarán automáticamente en todos tus dispositivos
          </p>
        </div>
      </div>
    </div>
  );
}
