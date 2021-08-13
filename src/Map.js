import React from "react";
import "./Map.css";
import { MapContainer as MapContainer, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from "./util";

function Map({ countries, caseType, center, zoom }) {
  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <MapContainer className="map">
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy;<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {showDataOnMap(countries, caseType)}
    </MapContainer>
  );
}

export default Map;
