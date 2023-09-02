import { useEffect, useState } from 'react';
import { RoundButton } from './components/RoundButton';
import Sidebar from './components/Sidebar';
import { WeatherDetails } from './components/WeatherDetails';
import { WeatherStateList } from './components/WeatherStateList';
import { api } from './services/api';


import { Main, Section } from './styles';
import GlobalStyles from './styles/global';
import axios from 'axios';
import { InteractiveMap } from './components/MapContainer';



interface Location {
  latitude?: number;
  longitude?: number;
  city: string;
}
interface WeatherStateProps {
  current: {
    dt: number;
    temp: number;
    humidity: number;
    wind_speed: number;
    visibility: string;
    pressure: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  };
  daily: {
    dt: number;
    temp: {
      max: number;
      min: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
}

export default function App() {
  const [weatherState, setWeatherState] = useState({} as WeatherStateProps);
  const [weather, setWeather] = useState({} as WeatherStateProps);
  const [searchByCity, setSearchByCity] = useState({} as WeatherStateProps);
  const [location, setLocation] = useState({} as Location);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [cityLatitude, setCityLatitude] = useState<number | undefined>(undefined);
  const [cityLongitude, setCityLongitude] = useState<number | undefined>(undefined);

  const [searchCity, setSearchCity] = useState('');

  const [searchCityDelayed, setSearchCityDelayed] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);


  const API_KEY = '9fd4363e87a12017542d3fd6ac228d52';

 

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearchCity(inputValue);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setSearchCityDelayed(inputValue);
        handleSearchSubmit();
      }, 3000) // Atraso de 300 milissegundos (ajuste conforme necessário)
    );
  };

  async function handleSearchSubmit() {
    try {
      const cityResponse = await api.get(`/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`);

      if (cityResponse.data.coord) {
        const { lat, lon } = cityResponse.data.coord;

        // Atualize os estados com a latitude e longitude da cidade
        setCityLatitude(lat);
        setCityLongitude(lon);

        const response = await api.get(
          `/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`
        );
        setSearchByCity(response.data);

      } else {
        console.error('City not found');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }


  useEffect(() => {
    axios.get('https://ipinfo.io/json?token=19fe29175dd341')
    .then(response => {
      const city = response.data.city;
      const coordinates = response.data.loc;
      const parts = coordinates.split(',');

      const latitude = parts[0]; // Obtenha a primeira parte (latitude)
      const longitude = parts[1]; // Obtenha a segunda parte (longitude)
      const data = { latitude, longitude, city }


      setLocation(data);
    })
    .catch(error => {
      console.error('IP:', error);
    });

    if (location.latitude && location.longitude) {
      api
        .get(
          `data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&units=metric&exclude=current,minutely,hourly,alerts&appid=${API_KEY}`
        )
        .then((response) => {
          setWeatherState(response.data);

        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });

      api.get(
        `/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
      )
        .then((response) => {
          setWeather(response.data);

          setDataLoaded(true); // Indica que os dados foram carregados
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }



  }, [location.latitude, location.longitude, searchCity]);




  return (
    <>
      <GlobalStyles />
      <Main>
        {dataLoaded ? (
          <>
            <Sidebar
              searchCityDelayed={searchCityDelayed}
              city={location.city}
              currentWeather={searchByCity.current || weather.current}
              handleSearchInputChange={handleSearchInputChange}
              handleSearchSubmit={handleSearchSubmit}
              searchCity={searchCity}
            />
            {searchByCity.current && searchByCity.daily ? (
              <Section>
                <header>
                  <RoundButton isCelsiusButton>°C</RoundButton>
                  <RoundButton>°F</RoundButton>
                </header>
                <WeatherStateList daily={searchByCity.daily} />
                <WeatherDetails
                  airPressure={searchByCity.current.pressure}
                  humidity={searchByCity.current.humidity}
                  visibility={searchByCity.current.visibility}
                  windSpeed={searchByCity.current.wind_speed}
                />
              </Section>
            ) : (
              <Section>
                <header>
                  <RoundButton isCelsiusButton>°C</RoundButton>
                  <RoundButton>°F</RoundButton>
                </header>
                <WeatherStateList daily={weatherState.daily} />
                <WeatherDetails
                  airPressure={weather.current.pressure}
                  humidity={weather.current.humidity}
                  visibility={weather.current.visibility}
                  windSpeed={weather.current.wind_speed}
                />
              </Section>


            )}
          </>

        ) : (
          <div>Loading...</div>
        )}

        < InteractiveMap latitude={cityLatitude || location.latitude} longitude={cityLongitude || location.longitude} />

      </Main>
    </>
  );

}