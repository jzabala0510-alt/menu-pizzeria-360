"use client";

import { useState, useEffect } from "react";
import { CartItem } from "../constants/menu";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, delta: number, size?: string) => void; 
  onCheckout: (note: string, deliveryType: string, coords?: string) => void;
  manualAddress: string;
  setManualAddress: (val: string) => void;
}

export default function CartModal({ 
  isOpen, onClose, cart, onUpdateQuantity, onCheckout, manualAddress, setManualAddress 
}: Props) {
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [note, setNote] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [coords, setCoords] = useState<string | undefined>(undefined);
  const [loadingGps, setLoadingGps] = useState(false);

  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + (item.precioFinal * item.quantity), 0);

  const handleGetLocation = () => {
    setLoadingGps(true);
    const options = { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords(`https://www.google.com/maps?q=${latitude},${longitude}`);
        setLoadingGps(false);
      }, 
      () => {
        setLoadingGps(false);
        alert("No se pudo obtener el GPS. Escribe tu dirección manualmente.");
      },
      options
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4">
      {/* CAMBIO CLAVE: max-h-[90vh] y flex flex-col 
          Esto evita que el modal se rompa en pantallas pequeñas.
      */}
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
        
        {/* Cabecera Fija */}
        <div className="p-6 pb-2 flex justify-between items-center bg-white z-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Tu Pedido</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors text-2xl">×</button>
        </div>

        {/* ZONA DE SCROLL: 
            Aquí es donde viven los productos y el formulario de dirección.
        */}
        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-hide">
          
          {/* Lista de Productos */}
          <div className="space-y-3 mb-6">
            {cart.length === 0 ? (
              <p className="text-center py-10 text-slate-400 font-medium italic">Tu carrito está vacío...</p>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${item.sizeSelected || index}`} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">
                      {item.nombre} 
                      {item.sizeSelected && (
                        <span className="ml-2 text-red-600 text-[10px] font-black uppercase bg-red-50 px-2 py-0.5 rounded-md">{item.sizeSelected}</span>
                      )}
                    </h4>
                    <p className="text-red-600 font-black text-sm mt-1">${(item.precioFinal * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-1 ml-4 shadow-sm">
                    <button onClick={() => onUpdateQuantity(item.id, -1, item.sizeSelected)} className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 hover:text-red-600">-</button>
                    <span className="font-black text-sm w-4 text-center text-slate-700">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1, item.sizeSelected)} className="w-8 h-8 flex items-center justify-center font-bold text-red-600 hover:bg-red-50 rounded-lg">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total informativo */}
          <div className="flex justify-between items-center p-5 bg-red-600 rounded-[1.5rem] mb-6 shadow-lg shadow-red-100">
            <span className="text-red-100 font-bold uppercase tracking-widest text-[10px]">Total a pagar</span>
            <span className="text-2xl font-black text-white">${total.toFixed(2)}</span>
          </div>

          {/* Opciones de Entrega */}
          <div className="space-y-4 pb-6">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button onClick={() => setDeliveryType("pickup")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${deliveryType === 'pickup' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}>🏪 Pickup</button>
                <button onClick={() => setDeliveryType("delivery")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${deliveryType === 'delivery' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}>🛵 Delivery</button>
            </div>

            {deliveryType === 'delivery' && (
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Exacta *</label>
                        <textarea 
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                            placeholder="Ej: Urb. Marin, Calle 6, Casa 15..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 focus:border-red-500 outline-none transition-all resize-none"
                            rows={2}
                        />
                    </div>
                    <button onClick={handleGetLocation} disabled={loadingGps} className={`w-full py-3 rounded-2xl text-[10px] font-black border-2 transition-all ${coords ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                        {loadingGps ? "⌛ OBTENIENDO..." : coords ? "✅ GPS ADJUNTO" : "📍 PUNTO GPS (OPCIONAL)"}
                    </button>

                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                        <p className="text-[10px] text-red-700 font-bold leading-tight text-center uppercase tracking-tight">
                            ⚠️ El costo del delivery será confirmado por WhatsApp al recibir su dirección.
                        </p>
                    </div>
                </div>
            )}

            <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="¿Notas adicionales? (Ej: Sin cebolla...)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 focus:border-red-500 outline-none resize-none"
                rows={1}
            />
          </div>
        </div>

        {/* PIE DE PÁGINA FIJO: 
            El botón de WhatsApp NUNCA desaparece. 
        */}
        <div className="p-6 bg-white border-t border-slate-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button 
            onClick={() => onCheckout(note, deliveryType, coords)}
            disabled={deliveryType === 'delivery' && !manualAddress}
            className={`w-full font-black py-5 rounded-[1.5rem] transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm ${
                deliveryType === 'delivery' && !manualAddress 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-100'
            }`}
          >
            Confirmar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}