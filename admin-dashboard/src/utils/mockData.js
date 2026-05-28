export const reports = [
  {
    id: 1,
    title: "Bache en Av. Central",
    description: "Bache grande que causa accidentes y daños a vehículos",
    category: "Infraestructura",
    status: "pendiente",
    municipality: "Tuxtla Gutiérrez",
    lat: 16.7529,
    lng: -93.1155,
    createdAt: "2024-01-15",
    resolvedAt: null,
    image: null
  },
  {
    id: 2,
    title: "Alumbrado público dañado",
    description: "Focos fundidos en toda la calle, peligro para peatones",
    category: "Alumbrado",
    status: "en_proceso",
    municipality: "San Cristóbal",
    lat: 16.7370,
    lng: -92.6376,
    createdAt: "2024-01-14",
    resolvedAt: null
  },
  {
    id: 3,
    title: "Basura acumulada",
    description: "Acumulación de desechos en esquina, mal olor",
    category: "Limpieza",
    status: "resuelto",
    municipality: "Comitán",
    lat: 16.2471,
    lng: -92.1352,
    createdAt: "2024-01-10",
    resolvedAt: "2024-01-13"
  },
  {
    id: 4,
    title: "Fuga de agua",
    description: "Tubería rota en esquina, desperdicio de agua",
    category: "Servicios",
    status: "en_proceso",
    municipality: "Tuxtla Gutiérrez",
    lat: 16.7590,
    lng: -93.1180,
    createdAt: "2024-01-13",
    resolvedAt: null
  },
  {
    id: 5,
    title: "Semáforo descompuesto",
    description: "No funciona el semáforo peatonal, riesgo para niños",
    category: "Tránsito",
    status: "pendiente",
    municipality: "Tapachula",
    lat: 14.9029,
    lng: -92.2586,
    createdAt: "2024-01-12",
    resolvedAt: null
  },
  {
    id: 6,
    title: "Contenedor de basura roto",
    description: "Contenedor público dañado, basura esparcida",
    category: "Limpieza",
    status: "pendiente",
    municipality: "San Cristóbal",
    lat: 16.7400,
    lng: -92.6400,
    createdAt: "2024-01-16",
    resolvedAt: null
  },
  {
    id: 7,
    title: "Bache en Periférico",
    description: "Bache profundo causa tráfico lento",
    category: "Infraestructura",
    status: "en_proceso",
    municipality: "Tuxtla Gutiérrez",
    lat: 16.7600,
    lng: -93.1100,
    createdAt: "2024-01-11",
    resolvedAt: null
  },
  {
    id: 8,
    title: "Árbol caído",
    description: "Árbol obstruye la vía pública",
    category: "Servicios",
    status: "resuelto",
    municipality: "Comitán",
    lat: 16.2500,
    lng: -92.1400,
    createdAt: "2024-01-09",
    resolvedAt: "2024-01-11"
  }
];

export const municipalities = [
  "Tuxtla Gutiérrez",
  "San Cristóbal",
  "Comitán",
  "Tapachula",
  "Palengue"
];

export const categories = [
  "Infraestructura",
  "Alumbrado",
  "Limpieza",
  "Servicios",
  "Tránsito"
];

export const getStatusColor = (status) => {
  const colors = {
    pendiente: "bg-yellow-100 text-yellow-800",
    en_proceso: "bg-blue-100 text-blue-800",
    resuelto: "bg-green-100 text-green-800"
  };
  return colors[status] || colors.pendiente;
};

export const getCategoryColor = (category) => {
  const colors = {
    Infraestructura: "bg-red-100 text-red-800",
    Alumbrado: "bg-purple-100 text-purple-800",
    Limpieza: "bg-green-100 text-green-800",
    Servicios: "bg-cyan-100 text-cyan-800",
    Tránsito: "bg-orange-100 text-orange-800"
  };
  return colors[category] || colors.Infraestructura;
};