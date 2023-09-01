import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


// ... Seus imports e código anterior

interface InteractiveMapProps {
  latitude?: number;
  longitude?: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ latitude, longitude }) => {
  const [map, setMap] = useState<L.Map | null>(null); // Estado para controlar o mapa

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined && map === null) {
      // Verifique se as coordenadas estão definidas e o mapa ainda não foi inicializado
      const newMap = L.map('map').setView([latitude, longitude], 13);

      // Adicione um mapa base (por exemplo, OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap);

      setMap(newMap); // Defina o mapa no estado
    } else if (latitude !== undefined && longitude !== undefined && map !== null) {
      // Se o mapa já estiver inicializado e as coordenadas mudarem, atualize a visualização
      map.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude, map]);

  return <div id="map" style={{ height: '350px', width: '80%', margin: 'auto', marginBottom: '50px' }}></div>;
};
