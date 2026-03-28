'use client'

import { createContext, useContext } from 'react'

const VisualEditingContext = createContext(false)

export function VisualEditingProvider({
  enabled,
  children,
}: {
  enabled: boolean
  children: React.ReactNode
}) {
  return (
    <VisualEditingContext.Provider value={enabled}>
      {children}
    </VisualEditingContext.Provider>
  )
}

export function useIsVisualEditing() {
  return useContext(VisualEditingContext)
}
