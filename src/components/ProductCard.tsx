import { MenuItem } from "../constants/menu";

interface Props {
  product: MenuItem;
  onAdd: (product: MenuItem) => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group active:scale-95 transition-all">
      <div className="flex-1">
        <h3 className="font-bold text-slate-800">{product.nombre}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.desc}</p>
      </div>
      <div className="flex flex-col items-end gap-2 ml-4">
        <span className="text-red-600 font-black text-sm">
        {typeof product.precio === 'number' 
            ? `$${product.precio}` 
            : `$${product.precio.mediana} - $${product.precio.grande}`}
        </span>
        <button 
          onClick={() => onAdd(product)}
          className="mt-2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          + Añadir
        </button>
      </div>
    </div>
  );
}