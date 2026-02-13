import { Box, Container, Typography } from '@mui/material'

const Weather = () => (
    <Box
        sx={{
            width: '100%',
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundColor: 'background.paper',
        }}
    >
        <Container maxWidth={false} sx={{ py: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
                Weather API placeholder
            </Typography>
        </Container>
    </Box>
)

export default Weather
