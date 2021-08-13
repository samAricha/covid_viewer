import React, { useEffect, useState } from "react";
import "./App.css";
import { MenuItem, Select, FormControl, Card } from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { CardContent } from "@material-ui/core";
import { sortData, prettyPrintStats } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("WorldWide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  //  https://disease.sh/v3/covid-19/countries/{country-code}
  //  https://disease.sh/v3/covid-19/all

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setMapCountries(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "WorldWide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        countryCode === "WorldWide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
        console.log(mapCenter);
        console.log(mapZoom);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 VIEWER</h1>
          <FormControl className="app__dropdowwn">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="WorldWide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            onClick={(e) => setCaseType("cases")}
            active={caseType === "cases"}
            title="Coronavirus Cases"
            cases={prettyPrintStats(countryInfo.todayCases)}
            total={prettyPrintStats(countryInfo.cases)}
          />
          <InfoBox
            onClick={(e) => setCaseType("recovered")}
            active={caseType === "recovered"}
            title="Recovered"
            cases={prettyPrintStats(countryInfo.todayRecovered)}
            total={prettyPrintStats(countryInfo.recovered)}
          />
          <InfoBox
            isGrey
            onClick={(e) => setCaseType("deaths")}
            active={caseType === "deaths"}
            title="Deaths"
            cases={prettyPrintStats(countryInfo.todayDeaths)}
            total={prettyPrintStats(countryInfo.deaths)}
          />
        </div>
        <div className="app__map">
          <Map
            caseType={caseType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">WorldWide new {caseType}</h3>
          <LineGraph className="app__graph" caseType={caseType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
