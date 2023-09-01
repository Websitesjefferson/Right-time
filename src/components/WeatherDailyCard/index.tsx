import { format, fromUnixTime } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Container, TemperatureValue } from './styles';


interface WeatherDaily {
  minTemperature: number;
  maxTemperature: number;
  weekDay: number;
}

interface WeatherDailyCardProps extends WeatherDaily {
  weatherState: {
    main: string;
    description: string;
    icon: string;
  };
}

export function WeatherDailyCard({
  maxTemperature,
  minTemperature,
  weatherState,
  weekDay,
}: WeatherDailyCardProps) {
  const formattedWeekDay = format(fromUnixTime(weekDay), 'EEE, dd LLL', { locale: ptBR });
  const formattedMinTemperature = Math.floor(minTemperature);
  const formattedMaxTemperature = Math.floor(maxTemperature);

  return (
    <Container>
      <h4>{formattedWeekDay}</h4>

      <img
        src={`http://openweathermap.org/img/wn/${weatherState.icon}@2x.png`}
        alt={weatherState.description}
      />
      <div className="temperatureValueContainer">
        <TemperatureValue $isMinTemperature={false}>
        <span> Max: {formattedMaxTemperature}ºC</span>
        </TemperatureValue>
        <TemperatureValue $isMinTemperature>
       <span> Min:  {formattedMinTemperature}ºC</span>
        </TemperatureValue>
      </div>
    </Container>
  );
}
