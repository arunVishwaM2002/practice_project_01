import { createContext, useContext } from 'react'
import type { City } from '@/types'

export interface CityContextValue {
  city: City
  setCityId: (id: string) => void
}

export const CityContext = createContext<CityContextValue | null>(null)

export function useCity(): CityContextValue {
  const ctx = useContext(CityContext)
  if (!ctx) throw new Error('useCity must be used inside <CityProvider>')
  return ctx
}
