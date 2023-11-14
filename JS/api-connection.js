
const handleWithWeatherAPI = () => {
   const apiKey = 'K9izveB1dCAARGFT2MoZjZ9X0X2mTMgR';
   const requestResult = {};

   requestResult.getCityUrl = cityName => 
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${cityName}`;

   requestResult.getCityWeatherUrl = cityKey => 
      `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${apiKey}&language=pt-br`;

   requestResult.to = function to (promise) {
      return promise
         .then(response => [null, response])
         .catch(error => [error, null]);
   };

   requestResult.fetchData = async function fetchData (url) {
      const [ error, response ] = await this.to(fetch(url));

      if(error){
         console.log('Erro: Não foi possível estabelecer conexão com a API.');
         return;
      };
      const data = await response.json();
      return data;
   };

   requestResult.getData = function getData (cityName, cityKey) {
      if(cityName){
         const url = this.getCityUrl(cityName);
         return this.fetchData(url);
      };
      const url = this.getCityWeatherUrl(cityKey);
      return this.fetchData(url);
   };

   return requestResult;
};

export { handleWithWeatherAPI };