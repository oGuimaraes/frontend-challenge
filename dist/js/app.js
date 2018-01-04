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

var autoCompleteCities = [
    'Belo Horizonte - MG | Brasil',
    'Rio de Janeiro - RJ | Brasil',
    'Manaus - AM | Brasil'
]

function createLink(city){
    return "https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text=' " + city + "') and u='c'&format=json";    
}

function addCelsiusSymbol(value){
    return value + 'º';
}

var promises = [];
for (var indice = 0; indice < 10; indice++) {
    promises[indice] = axios.get(createLink(citiesQueries[indice]));
}

axios
    .all(promises)
    .then(function (response) {
        for (var indice = 0; indice < 10; indice++){
            var forecast = response[indice].data.query.results.channel.item.forecast[0];
            var high = forecast.high;
            var low = forecast.low;
            
            var forecastTable = document.getElementById("forecast-table");

            var line = document.createElement("tr");
            forecastTable.appendChild(line);

            var maxColumn = document.createElement("td");
            maxColumn.setAttribute("class", "gmr-column-table");
            var maxTextNode = document.createTextNode(addCelsiusSymbol(high));
            line.appendChild(maxColumn);
            maxColumn.appendChild(maxTextNode);

            var minColumn = document.createElement("td");
            minColumn.setAttribute("class", "gmr-column-table");
            var minTextNode = document.createTextNode(addCelsiusSymbol(low));
            line.appendChild(minColumn);
            minColumn.appendChild(minTextNode);
            
            var citiesTextNode = document.createTextNode(citiesName[indice]);
            var citiesColumn = document.createElement("td");
            citiesColumn.setAttribute("class", "gmr-column-table");
            line.appendChild(citiesColumn);
            citiesColumn.appendChild(citiesTextNode); 
            
        }
    })

    .catch(function (error) {
        console.log("error");
    });

axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/municipios")
    .then(function (inputSearch) {

        var cityName = inputSearch.data[2309].nome;
        var stateName = inputSearch.data[2309].microrregiao.mesorregiao.UF.sigla;

        console.log("A cidade escolhida é " + cityName + " - " + stateName);
    })

var citiesSelect = document.querySelector('#cities-select');
var citiesSelectList = citiesSelect
    .querySelector('.gmr-autocomplete-list')
    .querySelector('ul');

for(var i = 0; i < autoCompleteCities.length; i++) {
    var cityNameList = document.createElement('li');
    var cityNameTextNode = document.createTextNode(autoCompleteCities[i]);
    
    cityNameList.appendChild(cityNameTextNode);
    citiesSelectList.appendChild(cityNameList);
}