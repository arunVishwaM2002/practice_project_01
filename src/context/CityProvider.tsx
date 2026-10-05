import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_CITY_ID } from '@/data/cities'
import { getCity } from '@/services/catalog'
import { CityContext } from './city'

const STORAGE_KEY = 'cinebook:city'

function readStoredCityId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && getCity(stored)) return stored
  } catch {
    // Storage can be unavailable (private mode, blocked site data)
  }
  return DEFAULT_CITY_ID
}

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityId, setCityIdState] = useState(readStoredCityId)

  const setCityId = useCallback((id: string) => {
    if (!getCity(id)) return
    setCityIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // Selection still applies for this visit
    }
  }, [])

  const value = useMemo(() => ({ city: getCity(cityId)!, setCityId }), [cityId, setCityId])

  return <CityContext value={value}>{children}</CityContext>
}
