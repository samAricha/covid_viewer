import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    // rgb: "rgb(204,16,52)",
    // half_op: "rgba(204,16,52,0.5)",
    mulitiplier: 800,
  },

  recovered: {
    hex: "#7DD71D",
    // rgb: "rgb(125,215,29)",
    // half_op: "rgba(125,215,29,0.5)",
    mulitiplier: 1200,
  },

  deaths: {
    hex: "#C0C0C0",
    // rgb: "rgb(251,68,67)",
    // half_op: "rgba(251,68,67,0.5)",
    mulitiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));

  //   sortedData.sort((a, b) => {
  //     if (a.cases > b.cases) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });
  //   return sortedData;
};

export const prettyPrintStats = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, caseType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[caseType].hex,
        fillColor: casesTypeColors[caseType].hex,
      }}
      radius={
        Math.sqrt(country[caseType] / 10) *
        casesTypeColors[caseType].mulitiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
