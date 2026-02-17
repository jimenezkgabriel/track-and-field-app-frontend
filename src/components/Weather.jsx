import { useState, useEffect } from 'react';
import { Box, Chip, Container, Stack, Typography } from '@mui/material'
import { getApi } from '../lib/api.js';

const DEFAULT_COORDS = { latitude: 34.0234, longitude: -84.6155 };
const buildWeatherUrl = (latitude, longitude) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;
const WEATHER_CODE_LABELS = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense intensity',
    56: 'Freezing Drizzle: Light',
    57: 'Freezing Drizzle: Dense intensity',
    61: 'Rain: Slight',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy intensity',
    66: 'Freezing Rain: Light',
    67: 'Freezing Rain: Heavy intensity',
    71: 'Snow fall: Slight',
    73: 'Snow fall: Moderate',
    75: 'Snow fall: Heavy intensity',
    77: 'Snow grains',
    80: 'Rain showers: Slight',
    81: 'Rain showers: Moderate',
    82: 'Rain showers: Violent',
    85: 'Snow showers slight',
    86: 'Snow showers heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const formatDate = () => new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        const fetchWeather = async (coords) => {
            try {
                const { data } = await getApi(buildWeatherUrl(coords.latitude, coords.longitude));
                const weatherData = {
                    time: formatTime(),
                    date: formatDate(),
                    temperature: Math.round(data.current.temperature_2m),
                    description: WEATHER_CODE_LABELS[data.current.weather_code] || 'Unknown weather condition',
                };
                setWeather(weatherData);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Location unavailable, using default');
            fetchWeather(DEFAULT_COORDS);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                fetchWeather({ latitude, longitude });
            },
            () => {
                setLocationError('Location blocked, using default');
                fetchWeather(DEFAULT_COORDS);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`
            }}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 1.5, md: 2 } }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1, md: 2 }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                >
                    <Stack spacing={0.5}>
                        {locationError && (
                            <Chip
                                label="Error fetching location. Reverting to secret default location"
                                color="error"
                                variant="filled"
                            />
                        )}
                        <Typography variant="overline" color="text.secondary">
                            Local Weather
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {loading ? 'Loading...' : `${weather.temperature}°F`}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        <Chip
                            label={loading ? 'Fetching conditions' : weather?.description}
                            color="primary"
                            variant="filled"
                        />
                        <Chip
                            label={loading ? '---' : weather?.date}
                            variant="outlined"
                        />
                        <Chip
                            label={loading ? '--:--' : weather?.time}
                            variant="outlined"
                        />
                    </Stack>
                </Stack>
            </Container>
        </Box>
    )
}

export default Weather
