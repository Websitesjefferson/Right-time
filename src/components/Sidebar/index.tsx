import { MdPlace } from 'react-icons/md';
import { PiMagnifyingGlass } from 'react-icons/pi'
import { City, Container, WeatherInfo, InputSearch, ContainerInput } from './styles';
import { format, fromUnixTime } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Logo from '../../assets/TempoCerto.png';


interface SidebarProps {
  city: string;
  currentWeather: {
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
  dataLoaded: boolean
  searchCityDelayed: string
  searchCity: string; // Adicione a prop searchCity
  handleSearchInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Adicione a prop handleSearchInputChange
  handleSearchSubmit: () => void; // Adicione a prop handleSearchSubmit
}

function Sidebar({ searchCityDelayed, city, currentWeather, searchCity, dataLoaded, handleSearchInputChange, handleSearchSubmit }: SidebarProps) {
 
  const formattedCurrentWeather = Math.floor(currentWeather.temp);

  const formattedDate = format(fromUnixTime(currentWeather.dt), 'EEE, dd LLL', { locale: ptBR });

  return (
    <Container>
      <img src={Logo} alt="" />

      <ContainerInput>
        <InputSearch
          placeholder='Pesquisar por cidade'
          value={searchCity}
          onChange={handleSearchInputChange}

        />
        {dataLoaded ? (
          <button onClick={handleSearchSubmit}>
            <PiMagnifyingGlass size={25} /> <span>Pesquisar</span>
          </button>) : (
          <div >Carregando...</div>
        )}



      </ContainerInput>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <City>
          <MdPlace size={24} />
          <div>
          <p>{searchCityDelayed || city}</p>
          </div>
          <span>{formattedDate}</span>
        </City>

        <WeatherInfo>
          <h1>
            {formattedCurrentWeather}
            <span>ºC</span>
          </h1>
          <img
            src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
            alt={currentWeather.weather[0].description}
          />
        </WeatherInfo>
      </div>
    </Container>
  );
}

export default Sidebar;
