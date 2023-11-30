import { useCallback, useEffect, useState } from 'react'

export default function useLocalStorage(
  key: string
): [string | undefined, (newValue: string | undefined) => void] {
  const [value, setValue] = useState<string | undefined>(
    localStorage.getItem(key) ?? undefined
  )

  const saveValue = useCallback(
    (newValue: string | undefined): void => {
      if (!newValue) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, newValue)
      }
      setValue(newValue)
    },
    [key]
  )

  const handleStorageChange = useCallback(() => {
    setValue(localStorage.getItem(key) ?? undefined)
  }, [key])

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [handleStorageChange])

  return [value, saveValue]
}
