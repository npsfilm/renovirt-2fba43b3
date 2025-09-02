
import { Smartphone, Camera, Layers } from 'lucide-react';

export const photoTypes = [
  {
    id: 'handy' as const,
    title: 'Handy',
    description: 'Fotos von Smartphone oder Tablet',
    icon: '/lovable-uploads/2c110715-00ab-48fb-a157-0759dbb4f54a.png?v=2',
    isCustomImage: true,
  },
  {
    id: 'kamera' as const,
    title: 'Kamera',
    description: 'Einzelaufnahmen von professioneller Kamera',
    icon: '/lovable-uploads/83ff57f8-6c2f-44ef-b68f-f5e16ab70d91.png?v=2',
    isCustomImage: true,
  },
  {
    id: 'bracketing-3' as const,
    title: 'Bracketing (3 Bilder)',
    description: 'HDR-Serie mit 3 verschiedenen Belichtungen',
    icon: '/lovable-uploads/35ef5c86-9355-44d9-827c-f4c536c83717.png?v=2',
    isCustomImage: true,
  },
  {
    id: 'bracketing-5' as const,
    title: 'Bracketing (5 Bilder)',
    description: 'HDR-Serie mit 5 verschiedenen Belichtungen',
    icon: '/lovable-uploads/345765bb-2387-48e6-9e64-329c84271522.png?v=2',
    isCustomImage: true,
  },
];
