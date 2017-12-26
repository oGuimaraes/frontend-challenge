var citiesQueries = [
    'rio de janeiro, rj',
    'sao paulo, sp',
    'belo horizonte, mg',
    'brasilia, go', 
    'belem, pa', 
    'salvador, ba', 
    'curitiba, pr',
    'fortaleza, ce', 
    'manaus, am',
    'joao pessoa, pb'
];

var citiesName = [
    'Rio de Janeiro', 
    'São Paulo', 
    'Belo Horizonte', 
    'Brasilia', 
    'Belém', 
    'Salvador', 
    'Curitiba', 
    'Fortaleza', 
    'Manaus', 
    'João Pessoa'
];

function createLink(city){
    return "https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text=' " + city + "') and u='c'&format=json";    
}

for (var indice = 0; indice < 10; indice++) {
    var indiceName = indice;

    axios
        .get(createLink(citiesQueries[indice]))
        .then(function (response) {
            var forecast = response.data.query.results.channel.item.forecast[0];
            var high = forecast.high;
            var low = forecast.low;
            
            var forecastTable = document.getElementById("forecast-table");

            var line = document.createElement("tr");
            forecastTable.appendChild(line);

            var maxColumn = document.createElement("td");
            maxColumn.setAttribute("class", "gmr-column-table");
            var maxTextNode = document.createTextNode(high);
            line.appendChild(maxColumn);
            maxColumn.appendChild(maxTextNode);

            var minColumn = document.createElement("td");
            minColumn.setAttribute("class", "gmr-column-table");
            var minTextNode = document.createTextNode(low);
            line.appendChild(minColumn);
            minColumn.appendChild(minTextNode);
            
            var citiesTextNode = document.createTextNode(citiesName[indiceName]);
            var citiesColumn = document.createElement("td");
            citiesColumn.setAttribute("class", "gmr-column-table");
            line.appendChild(citiesColumn);
            citiesColumn.appendChild(citiesTextNode);    
        })

    .catch(function (error) {
        console.log("error");
    });
}