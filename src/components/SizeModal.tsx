// src/components/SizeModal.tsx
import { MenuItem } from "../constants/menu";
import { useState, useEffect } from "react";

const ADICIONALES = [
  { id: 'cebolla', nombre: 'Cebolla', precio: 1.0 },
  { id: 'maiz', nombre: 'Maíz', precio: 1.5 },
  { id: 'pina', nombre: 'Piña', precio: 1.5 },
  { id: 'aceituna', nombre: 'Aceituna negra', precio: 2.0 },
  { id: 'jamon', nombre: 'Jamón', precio: 2.5 },
  { id: 'tocineta', nombre: 'Tocineta', precio: 2.5 },
  { id: 'pepperoni', nombre: 'Pepperoni', precio: 2.5 },
  { id: 'mozzarella', nombre: 'Mozzarella', precio: 3.0 },
];

interface SizeModalProps {
  item: MenuItem;
  onClose: () => void;
  onConfirm: (size: string, price: number, extras: string[]) => void;
}

export default function SizeModal({ item, onClose, onConfirm }: SizeModalProps) {

useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const precios = item.precio as { mediana: number; grande: number };
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Verificamos si es pizza (ajusta 'pizzas' al ID real de tu categoría)
  const isPizza = item.categoriaId === 'pizzas'; 
  
  const label1 = isPizza ? "Mediana" : "Con Pollo";
  const label2 = isPizza ? "Grande" : "Con Carne";

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const calculateExtrasTotal = () => {
    if (!isPizza) return 0;
    return selectedExtras.reduce((total, extraId) => {
      const extra = ADICIONALES.find(a => a.id === extraId);
      return total + (extra?.precio || 0);
    }, 0);
  };

  const handleConfirm = (opcion: string, basePrice: number) => {
    const finalPrice = basePrice + calculateExtrasTotal();
    onConfirm(opcion, finalPrice, isPizza ? selectedExtras : []);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      {/* Contenedor del Modal - Fondo Blanco */}
      <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-black text-slate-900 mb-1">Personalizar</h3>
        <p className="text-slate-600 font-medium mb-6">{item.nombre}</p>
        
        {/* SECCIÓN DE ADICIONALES (Solo para pizzas) */}
        {isPizza && (
          <div className="mb-6 border-b border-slate-100 pb-5">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
              ¿Deseas adicionales?
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
              {ADICIONALES.map(extra => (
                <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`text-left p-3 rounded-xl border-2 text-xs transition-all duration-150 ${
                        selectedExtras.includes(extra.id) 
                        ? 'border-red-600 bg-red-50 text-red-700 shadow-sm' 
                        : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200'
                    }`}
                    >
                    <div className="font-bold">{extra.nombre}</div>
                    <div className={`text-[10px] mt-0.5 ${
                        selectedExtras.includes(extra.id) ? 'text-red-500' : 'text-slate-400'
                    }`}>
                        +${extra.precio.toFixed(2)}
                    </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN DE OPCIONES PRINCIPALES (TAMAÑO O PROTEÍNA) */}
        <div className="space-y-3 mb-6">
          {[
            { label: label1, price: precios.mediana },
            { label: label2, price: precios.grande }
          ].map((opcion, index) => (
            <button 
              key={index}
              onClick={() => handleConfirm(opcion.label, opcion.price)}
              className="w-full flex justify-between items-center p-5 border-2 border-slate-100 rounded-2xl hover:border-red-500 hover:bg-red-50/50 transition-all duration-150 group"
            >
              <span className="font-bold text-slate-800 text-base">{opcion.label}</span>
              <div className="text-right">
                 {/* CAMBIO DE COLOR AQUÍ: text-red-600 */}
                 <span className="text-red-600 font-extrabold text-xl block">
                   ${(opcion.price + calculateExtrasTotal()).toFixed(2)}
                 </span>
                 {isPizza && selectedExtras.length > 0 && (
                   <span className="text-[10px] text-slate-400 font-medium italic">Con extras</span>
                 )}
              </div>
            </button>
          ))}
        </div>
        
        {/* BOTÓN CANCELAR */}
        <button 
          onClick={onClose} 
          className="w-full text-slate-500 font-semibold py-2 text-sm hover:text-red-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}