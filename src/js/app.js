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
    'Rio Branco	- Acre (AC)',
    'Maceió	- Alagoas (AL)',
    'Macapá - Amapá (AP)',
    'Manaus	- Amazonas (AM)',
    'Salvador -	Bahia (BA)',
    'Fortaleza - Ceará (CE)',
    'Brasília - Distrito Federal (DF)',
    'Vitória - Espírito Santo (ES)',
    'Goiânia - Goiás (GO)',
    'São Luís - Maranhão (MA)',
    'Cuiabá - Mato Grosso (MT)',
    'Campo Grande - Mato Grosso do Sul (MS)',
    'Belo Horizonte - Minas Gerais (MG)',
    'Belém - Pará (PA)',
    'João Pessoa - Paraíba (PB)',
    'Curitiba - Paraná (PR)',
    'Recife - Pernambuco (PE)',
    'Teresina - Piauí (PI)',
    'Rio de Janeiro - Rio de Janeiro (RJ)',
    'Natal - Rio Grande do Norte (RN)',
    'Porto Alegre - Rio Grande do Sul (RS)',
    'Porto Velho - Rondônia (RO)',
    'Boa Vista - Roraima (RR)',
    'Florianópolis - Santa Catarina (SC)',
    'São Paulo - São Paulo (SP)',
    'Aracaju - Sergipe (SE)',
    'Palmas - Tocantins (TO)'
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

/* for(var i = 0; i < autoCompleteCities.length; i++) {
    var cityNameList = document.createElement('li');
    var cityNameTextNode = document.createTextNode(autoCompleteCities[i]);
    
    cityNameList.appendChild(cityNameTextNode);
    citiesSelectList.appendChild(cityNameList);
}
*/

document.addEventListener("DOMContentLoaded", function(event) {
    function autocomplete(inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
              if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
    }
    autocomplete(document.getElementById("myInput"), autoCompleteCities);
}); 