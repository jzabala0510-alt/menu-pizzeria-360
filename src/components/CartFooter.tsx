// src/components/CartFooter.tsx
import { CartItem } from "../constants/menu"; // Asegúrate de la ruta correcta (../ o @/)

interface Props {
  cart: CartItem[];
  onCheckout: () => void;
}

export default function CartFooter({ cart, onCheckout }: Props) {
  // Cálculo de totales
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const total = cart.reduce((acc, item) => acc + (item.precioFinal * item.quantity), 0);

  // Si no hay productos, no mostrar nada
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-4 z-50 flex justify-center">
      <button 
        onClick={onCheckout}
        className="w-full max-w-md bg-green-600 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 transition-all transform active:scale-95 group"
      >
        {/* Sección Izquierda: Icono y Contador */}
        <div className="flex items-center gap-2 relative">
          <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
            {/* Icono de Carrito SVG */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2.5} 
              stroke="white" 
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-0 .079 2.131-0.341l2.039-6.406a1.125 1.125 0 00-1.07-1.451H6.383m.317 10.231c.478 0 .891.267 1.071.657a1.125 1.125 0 01-1.071 1.451 1.125 1.125 0 01-1.071-1.451h-2.142c0 1.258.917 2.142 2.142 2.142 1.121 0 1.912-.917 2.142-2.142.18-.39.593-.657 1.071-.657zm12.75 0c.478 0 .891.267 1.071.657a1.125 1.125 0 01-1.071 1.451 1.125 1.125 0 01-1.071-1.451h-2.142c0 1.258.917 2.142 2.142 2.142 1.121 0 1.912-.917 2.142-2.142.18-.39.593-.657 1.071-.657z" />
            </svg>
          </div>
          {/* Contador Flotante */}
          <span className="absolute -top-3 -right-3 bg-red-500 text-white font-black px-2.5 py-1 rounded-full text-xs shadow-lg border-2 border-green-600">
            {totalItems}
          </span>
        </div>

        {/* Sección Central: Texto */}
        <div className="flex-1 text-left">
          <span className="block text-xl font-extrabold uppercase tracking-tight">
            Ver mi pedido
          </span>
          <span className="block text-xs text-white/80 font-medium -mt-1">
            Revisa tu lista y confirma por WhatsApp
          </span>
        </div>

        {/* Sección Derecha: Precio Total */}
        <div className="text-right border-l border-white/20 pl-4 py-1">
          <span className="text-sm font-medium text-white/70 block">Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
      </button>
    </div>
  );
}