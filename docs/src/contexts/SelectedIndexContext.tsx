import { createContext, useState } from 'react'

type ContextState = {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
}

export const SelectedIndexContext = createContext<ContextState>({
  selectedIndex: 0,
  setSelectedIndex: (index: number) => {},
})

export const SelectedIndexProvider: React.FC = ({ children }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <SelectedIndexContext.Provider value={{ selectedIndex, setSelectedIndex }}>
      {children}
    </SelectedIndexContext.Provider>
  )
}
