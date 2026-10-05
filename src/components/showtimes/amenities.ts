import {
  Accessibility,
  CircleParking,
  MonitorPlay,
  Popcorn,
  Smartphone,
  Sofa,
  Volume2,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { Amenity } from '@/types'

export const AMENITY_ICONS: Record<Amenity, LucideIcon> = {
  IMAX: MonitorPlay,
  '4DX': Zap,
  'Dolby Atmos': Volume2,
  Recliners: Sofa,
  'Food & Beverages': Popcorn,
  Parking: CircleParking,
  'Wheelchair Access': Accessibility,
  'M-Ticket': Smartphone,
}
