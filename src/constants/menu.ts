export interface MenuItem {
  id: number;
  nombre: string;
  precio: number | { mediana: number; grande: number }; // Soporta precio único o por tamaño
  desc: string;
  categoriaId: string;
}

export interface MenuSection {
  id: string;
  categoria: string;
  items: MenuItem[];
}

export const MENU: MenuSection[] = [
  {
    id: "pizzas",
    categoria: "Pizzas Estilo New York",
    items: [
      { 
        id: 1, 
        nombre: "Margarita", 
        precio: { mediana: 10.99, grande: 14.99 }, 
        desc: "Salsa de tomate, mozzarella de primera.",
        categoriaId: "pizzas" 
      },
      { 
        id: 2, 
        nombre: "4 Estaciones", 
        precio: { mediana: 16.99, grande: 23.99 }, 
        desc: "Salsa de tomate, mozzarella, jamón, champiñones, maíz y aceitunas negras.",
        categoriaId: "pizzas" 
      },
      { 
        id: 3, 
        nombre: "Primavera", 
        precio: { mediana: 14.99, grande: 21.99 }, 
        desc: "Salsa de tomate, mozzarella, jamón, tocineta ahumada y maíz.",
        categoriaId: "pizzas" 
      },
      { 
        id: 4, 
        nombre: "BBQ", 
        precio: { mediana: 17.99, grande: 26.50 }, 
        desc: "Base de salsa BBQ especial, mozzarella, pollo, tocineta y cebolla fresca.",
        categoriaId: "pizzas" 
      },
      { 
        id: 5, 
        nombre: "Hawaiana", 
        precio: { mediana: 12.99, grande: 19.99 }, 
        desc: "Salsa de tomate, mozzarella, jamón, piña y maíz.",
        categoriaId: "pizzas" 
      }
    ]
  },
  {
    id: "pastas",
    categoria: "Pastas Artesanales",
    items: [
      { 
        id: 6, 
        nombre: "Fetucini Fungi al Tartufo", 
        precio: { mediana: 7.99, grande: 8.99 }, 
        desc: "Crema blanca con aroma de aceite de trufa y parmesano. Proteína a elección (Pollo o Lomito).",
        categoriaId: "pastas" 
      },
      { 
        id: 7, 
        nombre: "Frutti di Mare", 
        precio: 8.99, 
        desc: "Pasta fresca con pulpo, camarón y calamar en salsa de tomate artesanal.",
        categoriaId: "pastas" 
      },
      { 
        id: 8, 
        nombre: "Garganelli 4 Quesos", 
        precio: 7.50, 
        desc: "Pasta corta artesanal con un mix cremoso de mozzarella, pecorino, queso azul, Pollo y crema de leche.",
        categoriaId: "pastas" 
      },
      { 
        id: 9, 
        nombre: "Linguini Citrico con Camarones", 
        precio: 8.99, 
        desc: "Pasta Artesanal con camarones salteada en mantequilla de limon, albahaca fresca y lluvia de parmesano.",
        categoriaId: "pastas" 
      },
      { 
        id: 10, 
        nombre: "Bolognesa Tradicional", 
        precio: 5.99, 
        desc: "Salsa de carne, queso pecorino y tomate cherry.",
        categoriaId: "pastas" 
      }
    ]
  },
  {
    id: "milanesas",
    categoria: "Milanesas + 200g Papas Fritas",
    items: [
      { 
        id:11, 
        nombre: "A la Parmesana", 
        precio: 7.00, 
        desc: "Salsa roja, parmesano y toques de pesto.",
        categoriaId: "milanesas" 
      },
      { 
        id: 12, 
        nombre: "Napolitana", 
        precio: 8.00, 
        desc: "Salsa de tomate, mozzarella, jamón y tomates confitados.",
        categoriaId: "milanesas" 
      },
      { 
        id: 13, 
        nombre: "A Caballo", 
        precio: 6.00, 
        desc: "2 huevos, sal gruesa y pimienta negra.",
        categoriaId: "milanesas" 
      },
      { 
        id: 14, 
        nombre: "La 4 Queso", 
        precio: 7.00, 
        desc: "Pecorino, queso azul, ricota y parmesano",
        categoriaId: "milanesas" 
      },
      { 
        id: 15, 
        nombre: "LA Champiñon", 
        precio: 7.00, 
        desc: "Champiñones en salsa de vino tinto",
        categoriaId: "milanesas" 
      },
      { 
        id: 16, 
        nombre: "Cacio E Pepe", 
        precio: 7.00, 
        desc: "Salsa de vino blanco y pimienta negra.",
        categoriaId: "milanesas" 
      },
      { 
        id: 17, 
        nombre: "Diavola", 
        precio: 7.00, 
        desc: "Salsa roja picante, pepperoni y mozzarella.",
        categoriaId: "milanesas" 
      },
      { 
        id: 18, 
        nombre: "Sencilla", 
        precio: 6.00, 
        desc: "Milanesa sencilla con papas.",
        categoriaId: "milanesas" 
      },
    ]
  },
  {
    id: "pastichos",
    categoria: "Pastichos",
    items: [
      { 
        id: 19, 
        nombre: "Pasticho Tradicional", 
        precio: 8.00, 
        desc: "Receta clásica de la casa con el mejor sabor artesanal.",
        categoriaId: "pastichos" 
      },
      { 
        id: 20, 
        nombre: "Pasticho de Berenjena", 
        precio: 8.00, 
        desc: "Receta clásica de la casa con el mejor sabor artesanal.",
        categoriaId: "pastichos" 
      },
      { 
        id: 21, 
        nombre: "Pastel de Chucho", 
        precio: 8.00, 
        desc: "Receta clásica de la casa con el mejor sabor artesanal.",
        categoriaId: "pastichos" 
      }
    ]
  }
];

export interface CartItem extends MenuItem {
  quantity: number;
  sizeSelected?: string; // Para saber qué tamaño eligieron en la pizza
  precioFinal: number; // El precio real según el tamaño elegido
}