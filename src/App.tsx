import { useEffect, useState } from 'react';
import { RoundButton } from './components/RoundButton';
import Sidebar from './components/Sidebar';
import { WeatherDetails } from './components/WeatherDetails';
import { WeatherStateList } from './components/WeatherStateList';
import { api } from './services/api';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { ThreeCircles } from 'react-loader-spinner'

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


  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');



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

      if (searchCity.trim() === '') {
        toast.error('Por favor, insira uma cidade para pesquisar.', {
          position: 'top-center', // Posição da notificação
          autoClose: 1700, // Tempo que a notificação ficará visível em milissegundos (opcional)
        });
        return;
      }
      const cityResponse = await api.get(`/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`);

      if (cityResponse.data.coord) {
        const { lat, lon } = cityResponse.data.coord;

        // Atualize os estados com a latitude e longitude da cidade
        setCityLatitude(lat);
        setCityLongitude(lon);

        // Faça uma chamada à API do OpenWeatherMap para obter informações sobre o nascer e pôr do sol
        const sunriseSunsetResponse = await api.get(`/data/2.5/weather?q=${searchCity}&appid=${API_KEY}`);

        if (sunriseSunsetResponse.data.sys) {
          const sunriseTimestamp = sunriseSunsetResponse.data.sys.sunrise;
          const sunsetTimestamp = sunriseSunsetResponse.data.sys.sunset;

          // Converta os timestamps em horários legíveis
          const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString();
          const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString();

          // Atualize os estados com os horários do nascer e pôr do sol
          setSunrise(sunriseTime);
          setSunset(sunsetTime);
        }

        const response = await api.get(
          `/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`
        );
        setSearchByCity(response.data);

        // Reset the error state if the search is successful
        setDataLoaded(true);
      }

    } catch (error) {

      console.error('Error fetching weather data:', error);

      // Handle other errors here if needed
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
          `/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&units=metric&exclude=current,minutely,hourly,alerts&appid=${API_KEY}`
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

      // Faça uma chamada à API do OpenWeatherMap para obter informações sobre o nascer e pôr do sol
      api.get(`/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`)
        .then((response) => {
          if (response.data.sys) {
            const sunriseTimestamp = response.data.sys.sunrise;
            const sunsetTimestamp = response.data.sys.sunset;

            // Converta os timestamps em horários legíveis
            const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString();
            const sunsetTime = new Date(sunsetTimestamp * 1000).toLocaleTimeString();

            // Atualize os estados com os horários do nascer e pôr do sol
            setSunrise(sunriseTime);
            setSunset(sunsetTime);

          }
        })
        .catch((error) => {
          console.error('Error fetching sunrise/sunset data:', error);
        });
    }



  }, [location.latitude, location.longitude, searchCity]);

  const date = new Date();
  let hour = date.getHours();
  let minute: number = date.getMinutes();
  let minuteFormatted: string;

  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Lembre-se de que os meses são base 0
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  const fullDate = `${day}/${month}/${year}`;

  if (minute < 10) {
    minuteFormatted = "0" + minute;
  } else {
    minuteFormatted = minute.toString(); // Converter para string se não for menor que 10
  }

  return (
    <>
      <GlobalStyles />
      <Main>
        {dataLoaded ? (
          <>
            <Sidebar
              dataLoaded={dataLoaded}
              searchCityDelayed={searchCityDelayed}
              city={location.city}
              currentWeather={searchByCity.current || weather.current}
              handleSearchInputChange={handleSearchInputChange}
              handleSearchSubmit={handleSearchSubmit}
              searchCity={searchCity}
            />
            <div className="slider">
              <div >
                <p>Nascer do Sol: {sunrise}</p> /
                <p>Pôr do Sol: {sunset}</p> /
                <p>{fullDate }</p>
              </div>
            </div>
            {searchByCity.current && searchByCity.daily ? (
              <Section>
                <header>
                  <div >
                    <RoundButton isCelsiusButton>°C</RoundButton>
                    <RoundButton>°F</RoundButton>
                  </div>
                  <div>atual: {hour}:{minuteFormatted}</div>
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
                  <div >
                    <RoundButton isCelsiusButton>°C</RoundButton>
                    <RoundButton>°F</RoundButton>
                  </div>

                  <div>Última atualização: {hour}:{minuteFormatted}</div>
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
            < InteractiveMap latitude={cityLatitude || location.latitude} longitude={cityLongitude || location.longitude} />

          </>

        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ThreeCircles
              height="60"
              width="60"
              color="#51E5FF"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="three-circles-rotating"
              outerCircleColor=""
              innerCircleColor=""
              middleCircleColor=""
            />
          </div>

        )}

        <ToastContainer />

      </Main>
    </>
  );

}