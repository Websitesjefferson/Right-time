import React from 'react';
import { WeatherDailyCard } from '../WeatherDailyCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface WeatherStateListProps {
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

export const WeatherStateList: React.FC<WeatherStateListProps> = ({ daily }) => {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    //arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...sliderSettings}>
      {daily && daily.map((day) => (
        <div key={day.dt}>
          <WeatherDailyCard
            maxTemperature={day.temp.max}
            minTemperature={day.temp.min}
            weatherState={day.weather[0]}
            weekDay={day.dt}
          />
        </div>
      ))}
    </Slider>
  );
};
