import { createContext, useContext, useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { orange, blue } from '@mui/material/colors'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const ThemeContext = createContext(null)

export const MuiThemeProvider = ({ children }) => {
  const [mode, setMode] = useLocalStorage('themeMode', 'light')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? orange[900] : blue[500],
          },
        },
      }),
    [mode]
  )

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a MuiThemeProvider')
  }
  return context
}
