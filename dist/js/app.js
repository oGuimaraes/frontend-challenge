axios.get("https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='rio de janeiro, rj') and u='c'&format=json")
.then(function (response) {
    var forecast = response.data.query.results.channel.item.forecast[0];
    var high = forecast.high;
    var low = forecast.low;

    var forecastTable = document.getElementById("forecast-table");
    var line = document.createElement("tr");
    forecastTable.appendChild(line);

    var maxColumn = document.createElement("td");
    var maxTextNode = document.createTextNode(high);
    line.appendChild(maxColumn);
    maxColumn.appendChild(maxTextNode);

    var minColumn = document.createElement("td");
    var minTextNode = document.createTextNode(low);
    line.appendChild(minColumn);
    minColumn.appendChild(minTextNode);

})
.catch(function (error) {
    console.log("error");
});