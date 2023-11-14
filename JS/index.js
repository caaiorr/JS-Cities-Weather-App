import { handleWithWeatherAPI } from './api-connection.js';

const citiesWeatherApi = handleWithWeatherAPI();

const getConsts = (() => ({
   searchCityForm: document.querySelector('[data-js="searchForm"]'),
   storedCityName: localStorage.getItem('cityName'),
}))();

citiesWeatherApi.inputCleanAndFocus = function inputCleanAndFocus (event) {
   event.target.reset();
   event.target.nameCity.focus();
};

citiesWeatherApi.handleWithIcon = function handleWithIcon (WeatherIcon) {
   const imgIconEl = document.createElement('img');
   imgIconEl.setAttribute('src', `./src/icons/${WeatherIcon}.svg`);

   const iconEl = document.querySelector('[data-js="iconCity"]');
   iconEl.innerHTML = '';
   iconEl.append(imgIconEl);
};

citiesWeatherApi.renderInfos = function 
   renderInfos (LocalizedName, WeatherText, temperature, WeatherIcon) {
      const nameCityEl = document.querySelector('[data-js="nameCity"]');
      nameCityEl.innerText = LocalizedName;

      LocalizedName ? nameCityEl.classList.remove('fontMsg') : '';

      const weatherDescrEl = document.querySelector('[data-js="weatherCity"]');
      weatherDescrEl.innerText = WeatherText;

      const temperatureEl = 
         document.querySelector('[data-js="temperatureCity"]');
      temperatureEl.textContent = temperature;

      citiesWeatherApi.handleWithIcon(WeatherIcon);
   };

citiesWeatherApi.selectData = async function selectData (cityName) {
   const [{ Key, LocalizedName }] = await this.getData(cityName);
  
   const [{ WeatherText, Temperature, WeatherIcon }] = await 
      this.getData(null, Key);
      
   return [LocalizedName, WeatherText, Temperature, WeatherIcon];
};

citiesWeatherApi.setContent = async function setContent (cityName) {
   if(!await this.getData(cityName)){
      return;
   };

   const [ 
      LocalizedName, WeatherText,
      Temperature, WeatherIcon 
   ] = await this.selectData(cityName);

   const temperature = Temperature.Metric.Value;

   this.renderInfos(LocalizedName, WeatherText, temperature, WeatherIcon);
};

citiesWeatherApi.initApp = async function initApp (storedCityName) {
   storedCityName ? 
      this.setContent(storedCityName) : this.setContent('São Paulo');
};
    
citiesWeatherApi.handleSearchClick = async function handleSearchClick (event) {
   event.preventDefault();

   const inputCityValue = DOMPurify.sanitize(event.target.nameCity.value);
   localStorage.setItem('cityName', inputCityValue);
   
   citiesWeatherApi.setContent(inputCityValue);
   citiesWeatherApi.inputCleanAndFocus(event);
};

getConsts.searchCityForm
   .addEventListener('submit', citiesWeatherApi.handleSearchClick);

citiesWeatherApi.initApp(getConsts.storedCityName);