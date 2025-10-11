import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/useTheme';
import { useAuth } from '../context/useAuth';
import ThemeToggle from '../components/ThemeToggle';

const SettingsPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user, logout, syncSettings } = useAuth();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Sincronizar settings cuando cambien
  useEffect(() => {
    const syncTheme = async () => {
      if (user && !user.isAnonymous) {
        await syncSettings({ theme: isDark ? 'dark' : 'light' });
      }
    };
    syncTheme();
  }, [isDark, user, syncSettings]);

  const handleLogout = async () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmed) {
      await logout();
      navigate('/login');
    }
  };

  const handleManualSync = async () => {
    if (!user || user.isAnonymous) {
      setSyncMessage('Inicia sesión con Google para sincronizar');
      return;
    }
    
    setIsSyncing(true);
    setSyncMessage('');
    
    try {
      await syncSettings({ theme: isDark ? 'dark' : 'light' });
      setSyncMessage('✅ Configuración sincronizada correctamente');
      setTimeout(() => setSyncMessage(''), 3000);
    } catch {
      setSyncMessage('❌ Error al sincronizar');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24">
        {/* Header iOS Style */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-white mb-2">
            Configuración
          </h1>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Personaliza tu experiencia
          </p>
        </div>

        {/* iOS Style Settings Groups */}
        <div className="space-y-6">
          {/* Apariencia - iOS Card Style */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Theme Toggle Button - iOS Style */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center text-xl">
                  {isDark ? '🌙' : '☀️'}
                </div>
                <div className="text-left">
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    Tema
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isDark ? 'Oscuro' : 'Claro'}
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Cuenta y Sesión */}
          {user && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-700">
              <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
                👤 Cuenta
              </h2>
              
              <div className="space-y-4">
                {/* Info del usuario */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {user.avatar || '🌟'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-purple-900 dark:text-purple-100">
                        {user.name}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        {user.email || 'Modo anónimo'}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {user.isAnonymous ? (
                          <span className="text-xs px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full">
                            📱 Datos solo en este dispositivo
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full">
                            ☁️ Sincronizado con la nube
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sincronización manual */}
                {user && !user.isAnonymous && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Sincronización automática
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">
                          Tus configuraciones se guardan automáticamente
                        </p>
                      </div>
                      <button
                        onClick={handleManualSync}
                        disabled={isSyncing}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isSyncing ? '⏳ Sincronizando...' : '🔄 Sincronizar ahora'}
                      </button>
                    </div>
                    {syncMessage && (
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        {syncMessage}
                      </div>
                    )}
                  </div>
                )}

                {/* Botón de cerrar sesión */}
                <div className="pt-3 sm:pt-4 border-t border-purple-200 dark:border-purple-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg text-sm sm:text-base"
                  >
                    <span>🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
                  <p className="text-[10px] sm:text-xs text-center text-purple-600 dark:text-purple-400 mt-1.5 sm:mt-2">Sesión finalizada</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de Contacto */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-bold text-purple-900 dark:text-white">
                Contacto y Sugerencias
              </h2>
            </div>

            <div className="text-center mb-5">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🌟 Comparte tus sugerencias, ideas o reporta errores
              </p>
            </div>

            {/* Contact Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const nombre = formData.get('nombre') as string;
                const email = formData.get('email') as string;
                const mensaje = formData.get('mensaje') as string;

                // Validar campos
                const nombreInput = form.querySelector('#nombre') as HTMLInputElement;
                const emailInput = form.querySelector('#email') as HTMLInputElement;
                const mensajeInput = form.querySelector('#mensaje') as HTMLTextAreaElement;
                const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

                // Limpiar errores previos
                [nombreInput, emailInput, mensajeInput].forEach(input => {
                  input.classList.remove('border-red-500', 'dark:border-red-500');
                  const errorMsg = input.parentElement?.querySelector('.error-message');
                  if (errorMsg) errorMsg.remove();
                });

                let hasError = false;

                // Validar nombre
                if (!nombre || nombre.trim().length < 2) {
                  nombreInput.classList.add('border-red-500', 'dark:border-red-500');
                  const error = document.createElement('p');
                  error.className = 'error-message text-xs text-red-500 dark:text-red-400 mt-1';
                  error.textContent = 'El nombre debe tener al menos 2 caracteres';
                  nombreInput.parentElement?.appendChild(error);
                  hasError = true;
                }

                // Validar email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email || !emailRegex.test(email)) {
                  emailInput.classList.add('border-red-500', 'dark:border-red-500');
                  const error = document.createElement('p');
                  error.className = 'error-message text-xs text-red-500 dark:text-red-400 mt-1';
                  error.textContent = 'Por favor ingresa un correo electrónico válido';
                  emailInput.parentElement?.appendChild(error);
                  hasError = true;
                }

                // Validar mensaje
                if (!mensaje || mensaje.trim().length < 10) {
                  mensajeInput.classList.add('border-red-500', 'dark:border-red-500');
                  const error = document.createElement('p');
                  error.className = 'error-message text-xs text-red-500 dark:text-red-400 mt-1';
                  error.textContent = 'El mensaje debe tener al menos 10 caracteres';
                  mensajeInput.parentElement?.appendChild(error);
                  hasError = true;
                }

                if (hasError) return;

                // Enviar el formulario
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="text-2xl">⏳</span><span>Enviando...</span>';

                try {
                  // Usar FormSubmit.co para envío directo (funciona en dev y producción)
                  const response = await fetch('https://formsubmit.co/ajax/neptnunestudios888@gmail.com', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                      name: nombre,
                      email: email,
                      message: mensaje,
                      _subject: `Feedback AstroLab - ${nombre}`,
                      _template: 'box',
                      _captcha: 'false'
                    })
                  });

                  const data = await response.json();

                  if (response.ok && data.success) {
                    // Éxito
                    submitBtn.innerHTML = '<span class="text-2xl">✅</span><span>¡Mensaje Enviado!</span>';
                    submitBtn.classList.remove('from-purple-500', 'via-purple-600', 'to-indigo-600');
                    submitBtn.classList.add('from-green-500', 'via-green-600', 'to-green-700');
                    form.reset();
                    
                    setTimeout(() => {
                      submitBtn.disabled = false;
                      submitBtn.innerHTML = '<span class="text-2xl">🚀</span><span>Enviar Mensaje</span>';
                      submitBtn.classList.remove('from-green-500', 'via-green-600', 'to-green-700');
                      submitBtn.classList.add('from-purple-500', 'via-purple-600', 'to-indigo-600');
                    }, 3000);
                  } else {
                    throw new Error('Error al enviar');
                  }
                } catch {
                  // Error
                  submitBtn.innerHTML = '<span class="text-2xl">❌</span><span>Error al enviar</span>';
                  submitBtn.classList.remove('from-purple-500', 'via-purple-600', 'to-indigo-600');
                  submitBtn.classList.add('from-red-500', 'via-red-600', 'to-red-700');
                  
                  setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="text-2xl">🚀</span><span>Enviar Mensaje</span>';
                    submitBtn.classList.remove('from-red-500', 'via-red-600', 'to-red-700');
                    submitBtn.classList.add('from-purple-500', 'via-purple-600', 'to-indigo-600');
                  }, 3000);
                }
              }}
              className="space-y-5"
            >
              
              {/* Campo Nombre */}
              <div className="space-y-2">
                <label 
                  htmlFor="nombre" 
                  className="flex items-center gap-2 text-sm font-semibold text-purple-900 dark:text-purple-100"
                >
                  <span>👤</span>
                  <span>Nombre</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              {/* Campo Email */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="flex items-center gap-2 text-sm font-semibold text-purple-900 dark:text-purple-100"
                >
                  <span>✉️</span>
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>

              {/* Campo Mensaje */}
              <div className="space-y-2">
                <label 
                  htmlFor="mensaje" 
                  className="flex items-center gap-2 text-sm font-semibold text-purple-900 dark:text-purple-100"
                >
                  <span>💬</span>
                  <span>Mensaje</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  placeholder="Cuéntanos tus ideas, sugerencias o reporta algún error..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none resize-none"
                />
              </div>

              {/* Botón Enviar */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 transform disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="text-2xl">🚀</span>
                <span>Enviar Mensaje</span>
              </button>
            </form>
          </div>
        </div>

        {/* Powered by Neptune Studios - Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-50/90 via-purple-50/70 to-transparent dark:from-gray-900/90 dark:via-gray-900/70 backdrop-blur-sm py-4 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <a
              href="https://neptunestudios.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors font-medium"
            >
              <span className="text-lg">✨</span>
              <span>Powered by Neptune Studios</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;