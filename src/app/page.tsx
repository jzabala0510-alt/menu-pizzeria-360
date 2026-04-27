"use client";

import { useState } from "react";
import { MENU, MenuItem, CartItem, MenuSection } from "../constants/menu";
import ProductCard from "../components/ProductCard";
import CartFooter from "../components/CartFooter";
import CartModal from "../components/CartModal";
import SizeModal from "../components/SizeModal";

const ICONOS_CATEGORIA: { [key: string]: string } = {
  pizzas: "🍕",
  pastas: "🍝",
  milanesas: "🥩",
  pastichos: "🥘",
  ensaladas: "🥗",
  bebidas: "🥤",
};

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [itemToSize, setItemToSize] = useState<MenuItem | null>(null);
  
  // 1. Mantenemos el estado de la dirección aquí para controlarlo globalmente
  const [manualAddress, setManualAddress] = useState("");

  const addToCart = (product: MenuItem) => {
    if (typeof product.precio === 'object') {
      setItemToSize(product);
    } else {
      confirmAddToCart(product, product.precio as number);
    }
  };

  const confirmAddToCart = (product: MenuItem, precioFinal: number, size?: string, extras: string[] = []) => {
    setCart(prev => {
      const extrasTexto = extras.length > 0 ? ` (+${extras.join(", ")})` : "";
      const nombreCompleto = `${product.nombre}${extrasTexto}`;
      const existing = prev.find(item => item.nombre === nombreCompleto && item.sizeSelected === size);

      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      
      const newItem: CartItem = { 
        ...product,
        id: Date.now(), 
        nombre: nombreCompleto,
        quantity: 1, 
        sizeSelected: size, 
        precioFinal 
      };
      return [...prev, newItem];
    });
    setItemToSize(null);
  };

  const updateQuantity = (id: number, delta: number, size?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.sizeSelected === size) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter((item): item is CartItem => item !== null));
  };

  // 2. CORRECCIÓN: Ahora incluimos la dirección manual en el mensaje de WhatsApp
  const handleWhatsApp = (note: string, deliveryType: string, coords?: string) => {
    const phone = "584221733933"; 
    const items = cart.map(i => {
      const sizeTag = i.sizeSelected ? ` [${i.sizeSelected.toUpperCase()}]` : '';
      return `• ${i.quantity}x ${i.nombre}${sizeTag} - $${(i.precioFinal * i.quantity).toFixed(2)}`;
    }).join("\n");
    
    const total = cart.reduce((acc, i) => acc + (i.precioFinal * i.quantity), 0);
    const metodo = deliveryType === 'delivery' ? "🛵 *DELIVERY*" : "🏪 *PICKUP*";
    
    // Texto de dirección y GPS
    const infoEntrega = deliveryType === 'delivery' 
      ? `\n🏠 *Dirección:* ${manualAddress || 'No proporcionada'}${coords ? `\n📍 *Mapa:* ${coords}` : ""}`
      : "";

    const nota = note.trim() ? `\n\n*Notas:* _${note}_` : "";
    
    const msg = `¡Hola Pizzería 360! 🍕\n\nPedido para ${metodo}:${infoEntrega}\n\n${items}${nota}\n\n*Total: $${total.toFixed(2)}*`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      setIsMenuDrawerOpen(false);
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  return (
    <main className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32 relative">
      
      {/* BOTÓN FLOTANTE */}
      <button 
        onClick={() => setIsMenuDrawerOpen(true)}
        className="fixed top-6 left-6 z-40 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-slate-100 hover:scale-105 active:scale-95 transition-all text-slate-600 hover:text-red-600"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* MENÚ LATERAL (DRAWER) */}
      {isMenuDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMenuDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800 tracking-tighter">Categorías</h2>
              <button 
                onClick={() => setIsMenuDrawerOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
              {MENU.map((seccion) => (
                <button
                  key={seccion.id}
                  onClick={() => scrollToCategory(seccion.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-colors hover:bg-red-50 group"
                >
                  <span className="text-2xl w-8 text-center">{ICONOS_CATEGORIA[seccion.id] || "🍽️"}</span>
                  <span className="font-bold text-slate-700 group-hover:text-red-700 text-sm">{seccion.categoria}</span>
                </button>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pizzería 360°</p>
            </div>
          </div>
        </>
      )}

      {/* HEADER */}
      <div className="pt-12 pb-6 bg-white flex flex-col items-center">
        <div className="w-24 h-24 relative rounded-full overflow-hidden shadow-xl border-4 border-white mb-4">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">PIZZERÍA 360°</h1>
        <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mt-1">El mejor sabor artesanal</p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="px-4 space-y-12 mt-8">
        {MENU.map((seccion: MenuSection) => (
          <section key={seccion.id} id={seccion.id} className="scroll-mt-24">
            <h2 className="text-xl font-black mb-5 flex items-center gap-3 text-slate-800">
              <span className="h-6 w-1.5 bg-red-600 rounded-full"></span>
              {seccion.categoria}
            </h2>
            <div className="space-y-4">
              {seccion.items.map(item => (
                <ProductCard key={item.id} product={item} onAdd={() => addToCart(item)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <CartFooter cart={cart} onCheckout={() => setIsModalOpen(true)} />
      
      {/* 3. PASAR DIRECCIÓN AL MODAL: 
          Asegúrate de que tu CartModal acepte estas nuevas props para manejar la dirección allí dentro */}
      <CartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cart={cart} 
        onUpdateQuantity={updateQuantity} 
        onCheckout={handleWhatsApp}
        manualAddress={manualAddress}
        setManualAddress={setManualAddress}
      />

      {itemToSize && (
        <SizeModal 
          item={itemToSize} 
          onClose={() => setItemToSize(null)} 
          onConfirm={(size, price, extras) => confirmAddToCart(itemToSize, price, size, extras)} 
        />
      )}
    </main>
  );
}