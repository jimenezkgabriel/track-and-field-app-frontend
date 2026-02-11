import { AppBar, Box, Button, Divider, Toolbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../utils/AppContext.jsx'
import Switch from './Switch.jsx'
import logo from '../assets/logo.png'

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, setUserId } = useAppContext()

  const handleLogout = () => {
    setToken(null)
    setUserId(null)
    navigate('/')
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
            borderRadius: '50%',
            width: 48,
            height: 48,
            mr: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ height: 36, width: 'auto' }}
          />
        </Box>
        <Divider orientation="vertical" sx={{ height: 32, mr: 3, bgcolor: 'primary.contrastText' }} />
        <Switch />
        <Box sx={{ flexGrow: 1 }} />
        {token ? (
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
            }}
          >
            Log out
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
            }}
          >
            Log in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
