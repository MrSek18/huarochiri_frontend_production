import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Configuracion({ user, onLogout }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState({
    name: false,
    email: false,
    password: false,
    dni: false,
    celular: false // Cambiado de 'phone' a 'celular'
  });
  
  // Refs para cada input
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dniRef = useRef(null);
  const celularRef = useRef(null); // Cambiado de phoneRef a celularRef

  // Valores iniciales (usa 'celular' en lugar de 'phone')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    dni: user?.dni || '',
    celular: user?.celular || '' // Cambiado de 'phone' a 'celular'
  });

  // Función para ajustar ancho de inputs (se mantiene igual)
  const adjustInputWidth = (ref, value) => {
    if (ref.current) {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'pre';
      tempSpan.style.font = window.getComputedStyle(ref.current).font;
      tempSpan.style.padding = '0 12px';
      tempSpan.textContent = value || '';
      
      document.body.appendChild(tempSpan);
      ref.current.style.width = `${tempSpan.scrollWidth + 24}px`;
      document.body.removeChild(tempSpan);
    }
  };

  useEffect(() => {
    adjustInputWidth(nameRef, formData.name);
    adjustInputWidth(emailRef, formData.email);
    adjustInputWidth(dniRef, formData.dni);
    adjustInputWidth(celularRef, formData.celular); // Cambiado de phoneRef a celularRef
  }, [formData]);

  const handleEdit = (field) => {
    setEditing({...editing, [field]: true});
    setTimeout(() => {
      switch(field) {
        case 'name': nameRef.current.focus(); break;
        case 'email': emailRef.current.focus(); break;
        case 'password': passwordRef.current.focus(); break;
        case 'dni': dniRef.current.focus(); break;
        case 'celular': celularRef.current.focus(); break; // Cambiado de 'phone' a 'celular'
      }
    }, 50);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#FBF2DF]" style={{ fontFamily: '"Roboto SemiCondensed", sans-serif' }}>
      <div className="h-full w-full max-w-md space-y-6 bg-white rounded-xl shadow-lg overflow-y-auto">
        
        {/* Botón de retroceso */}
        <div className="sticky top-0 bg-white z-10 p-1">
          <button onClick={() => navigate(-1)} className="group flex p-3 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-8 h-8 text-black group-hover:text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className=" ml-5 mr-5 ">
          <h1 className="text-2xl font-medium mb-6">Configuración de cuenta</h1>
          
          <div className="space-y-6">
            {/* Sección de Nombre (se mantiene igual) */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Nombre:</label>
                <input
                  ref={nameRef}
                  required
                  disabled={!editing.name}
                  className="mt-1 block w-full px-3 py-2 border-2 border-[#0F4C30] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#209F65]"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <button 
                    onClick={() => handleEdit('name')}
                    className="mt-6 px-2 py-1 bg-[#C9F9C7] rounded-md border-2 border-[#0F4C30] hover:bg-[#B0E8AE] transition-colors text-black font-light text-lg"
              >
                    Editar
              </button>
            </div>

            {/* Sección de Email (se mantiene igual) */}
            <div className="flex flex-col">
              <div className="w-full">
                <label className="w-full block text-sm font-medium mb-1">Email:</label>
              </div>
              <div className='flex gap-2 items-center'>
                <input
                  ref={emailRef}
                  type="email"
                  disabled={!editing.email}
                  className=" block px-3 py-2 border-2 border-[#0F4C30] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#209F65]"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              
                <button onClick={() => handleEdit('email')} className="px-2 py-1 bg-[#C9F9C7] rounded-md border-2 border-[#0F4C30] hover:bg-[#B0E8AE] transition-colors text-black font-light text-lg">
                    Editar
                </button>
              </div>
            </div>

            {/* Sección de Contraseña (se mantiene igual) */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Contraseña:</label>
                <input
                  ref={passwordRef}
                  type="password"
                  disabled={!editing.password}
                  className="mt-1 block w-full px-3 py-2 border-2 border-[#0F4C30] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#209F65]"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
              <button onClick={() => handleEdit('password')} className="mt-6 p-2 bg-[#C9F9C7] rounded-md border-2 border-[#0F4C30] hover:bg-[#B0E8AE] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0F4C30" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            {/* Sección de DNI (se mantiene igual) */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">DNI:</label>
                <input
                  ref={dniRef}
                  disabled={!editing.dni}
                  className="mt-1 block w-full px-3 py-2 border-2 border-[#0F4C30] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#209F65]"
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                />
              </div>
              <button onClick={() => handleEdit('dni')} className="mt-6 p-2 bg-[#C9F9C7] rounded-md border-2 border-[#0F4C30] hover:bg-[#B0E8AE] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0F4C30" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            {/* Sección de Celular (actualizada de 'phone' a 'celular') */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Número de celular:</label>
                <input
                  ref={celularRef} // Cambiado de phoneRef a celularRef
                  type="tel"
                  disabled={!editing.celular} // Cambiado de 'phone' a 'celular'
                  className="mt-1 block w-full px-3 py-2 border-2 border-[#0F4C30] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-[#209F65]"
                  value={formData.celular} // Cambiado de 'phone' a 'celular'
                  onChange={(e) => setFormData({...formData, celular: e.target.value})} // Cambiado de 'phone' a 'celular'
                />
              </div>
              <button 
                onClick={() => handleEdit('celular')} // Cambiado de 'phone' a 'celular'
                className="mt-6 p-2 bg-[#C9F9C7] rounded-md border-2 border-[#0F4C30] hover:bg-[#B0E8AE] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0F4C30" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            {/* Botón de Cerrar Sesión (se mantiene igual) */}
            <div className="pt-8">
              <button
                onClick={onLogout}
                className="w-full py-2 px-4 bg-[#F86060] text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}