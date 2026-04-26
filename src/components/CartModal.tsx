"use client";

import { useState, useEffect } from "react";
import { CartItem } from "../constants/menu";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, delta: number, size?: string) => void; 
  onCheckout: (note: string, deliveryType: string, coords?: string) => void;
}

export default function CartModal({ isOpen, onClose, cart, onUpdateQuantity, onCheckout }: Props) {
  
  useEffect(() => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }

  return () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
  };
}, [isOpen]);

  const [note, setNote] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [coords, setCoords] = useState<string | undefined>(undefined);
  const [loadingGps, setLoadingGps] = useState(false);

  // 2. EL RETORNO NULO VA DESPUÉS DE LOS HOOKS
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.precioFinal * item.quantity), 0);

  const handleGetLocation = () => {
    setLoadingGps(true);
    
    if (!navigator.geolocation) {
        alert("Tu navegador no soporta geolocalización.");
        setLoadingGps(false);
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 8000, // Bajamos a 8 segundos para que no se quede pegado
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (position) => {
        const { latitude, longitude } = position.coords;
        // Formato estandarizado para Google Maps
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setCoords(link);
        setLoadingGps(false);
        }, 
        (error) => {
        setLoadingGps(false);
        let mensaje = "No se pudo obtener la ubicación.";
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
            mensaje = "Por favor, permite el acceso al GPS en la configuración de tu navegador.";
            break;
            case error.POSITION_UNAVAILABLE:
            mensaje = "La información de ubicación no está disponible (revisa tu señal).";
            break;
            case error.TIMEOUT:
            mensaje = "Se agotó el tiempo de espera. Intenta de nuevo.";
            break;
        }
        
        console.error("Error detallado de GPS:", error.message);
        alert(mensaje);
        },
        options
    );
    };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 pt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Tu Pedido</h2>
            <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors text-2xl"
            >
                ×
            </button>
          </div>

          {/* LISTA DE PRODUCTOS */}
          <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2 mb-6 scrollbar-hide">
            {cart.length === 0 ? (
              <p className="text-center py-10 text-slate-400 font-medium italic">Tu carrito está vacío...</p>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${item.sizeSelected || index}`} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">
                      {item.nombre} 
                      {item.sizeSelected && (
                        <span className="ml-2 text-red-600 text-[10px] font-black uppercase bg-red-50 px-2 py-0.5 rounded-md">
                          {item.sizeSelected}
                        </span>
                      )}
                    </h4>
                    <p className="text-red-600 font-black text-sm mt-1">
                      ${(item.precioFinal * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-1 ml-4 shadow-sm">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1, item.sizeSelected)} 
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 hover:text-red-600 transition-colors"
                    >-</button>
                    <span className="font-black text-sm w-4 text-center text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1, item.sizeSelected)} 
                      className="w-8 h-8 flex items-center justify-center font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center p-5 bg-red-600 rounded-[1.5rem] mb-6 shadow-xl shadow-red-100">
            <span className="text-red-100 font-bold uppercase tracking-widest text-[10px]">Total a pagar</span>
            <span className="text-2xl font-black text-white">${total.toFixed(2)}</span>
          </div>

          {/* METODO DE ENTREGA */}
          <div className="space-y-4">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button 
                onClick={() => setDeliveryType("pickup")} 
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${deliveryType === 'pickup' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                >
                🏪 Pickup
                </button>
                <button 
                onClick={() => setDeliveryType("delivery")} 
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${deliveryType === 'delivery' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                >
                🛵 Delivery
                </button>
            </div>

            {deliveryType === 'pickup' ? (
                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                    <p className="text-[10px] font-black text-red-800 uppercase tracking-tight">Recoger en:</p>
                    <p className="text-xs text-red-900 font-bold">A Confirmar vía WhatsApp.</p>
                </div>
                </div>
            ) : (
                /* Agrupamos el botón y la nota informativa */
                <div className="space-y-3">
                <button 
                    onClick={handleGetLocation}
                    disabled={loadingGps}
                    className={`w-full py-4 rounded-2xl text-[11px] font-black transition-all border-2 ${coords ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-red-600 text-red-600 shadow-sm active:scale-[0.98]'}`}
                >
                    {loadingGps ? "⌛ OBTENIENDO GPS..." : coords ? "✅ GPS CAPTURADO" : "📍 COMPARTIR MI UBICACIÓN GPS"}
                </button>
                
                <p className="text-center text-[10px] text-red-600 font-bold leading-tight px-4">
                    * El precio del delivery será confirmado vía WhatsApp al recibir su pedido.
                </p>
                </div>
            )}

            <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="¿Alguna instrucción adicional?"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                rows={2}
            />
         </div>

          <button 
            onClick={() => onCheckout(note, deliveryType, coords)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-green-100 transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            Confirmar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}