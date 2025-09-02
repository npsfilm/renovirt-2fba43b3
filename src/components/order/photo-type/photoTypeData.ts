
import { Smartphone, Camera, Layers } from 'lucide-react';

export const photoTypes = [
  {
    id: 'handy' as const,
    title: 'Handy',
    description: 'Fotos von Smartphone oder Tablet',
    icon: '/lovable-uploads/2c110715-00ab-48fb-a157-0759dbb4f54a.png',
    isCustomImage: true,
  },
  {
    id: 'kamera' as const,
    title: 'Kamera',
    description: 'Einzelaufnahmen von professioneller Kamera',
    icon: Camera,
    isCustomImage: false,
  },
  {
    id: 'bracketing-3' as const,
    title: 'Bracketing (3 Bilder)',
    description: 'HDR-Serie mit 3 verschiedenen Belichtungen',
    icon: Layers,
    isCustomImage: false,
  },
  {
    id: 'bracketing-5' as const,
    title: 'Bracketing (5 Bilder)',
    description: 'HDR-Serie mit 5 verschiedenen Belichtungen',
    icon: Layers,
    isCustomImage: false,
  },
];
