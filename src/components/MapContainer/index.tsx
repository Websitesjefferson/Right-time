import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface InteractiveMapProps {
  latitude?: number;
  longitude?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ latitude, longitude }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      if (mapRef.current === null) {
        // Se o mapa ainda não foi inicializado, crie-o
        const newMap = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(newMap);
        mapRef.current = newMap;
      } else {
        // Se o mapa já foi inicializado, apenas atualize a visualização
        mapRef.current.setView([latitude, longitude], 13);
      }
    }
  }, [latitude, longitude]);

  return <div id="map" style={{ height: '350px', width: '80%', margin: 'auto', marginBottom: '50px' }}></div>;
};
