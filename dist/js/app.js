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
    /* a função autocomplete recebe dois argumentos, inp(Input: elemento de campo de texto)
    e arr(Array: cidades pré-definidas */
    function autocomplete(inp, arr) {
        var currentFocus;
        /* executa a função quando alguém escreve no campo de texto(input)*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /* fecha todas as listas já abertas de valores preenchidos automaticamente*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /* cria um DIV e define os atributos: id=autocomplete-list & class=autocomplete-items*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /* o elemento DIV se torna um filho da div autocomplete(container)*/
            this.parentNode.appendChild(a);
            /* para cada item do array...*/
            for (i = 0; i < arr.length; i++) {
              /* verifica se o item começa com as mesmas letras que o valor do campo de texto:*/
              if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /* cria uma div para cada elemento correspondente:*/
                b = document.createElement("DIV");
                /* coloca em negrito as letras semelhantes: */
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /* cria um elemento no HTML contendo o valores iguais, correspondente ao valor da matriz atual*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /* Executa uma função quando a div é clicada:*/
                    b.addEventListener("click", function(e) {
                    /* insere o valor para o input autocomplete:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /* fecha a lista de valores preenchidos automaticamente,
                    (ou qualquer outra lista aberta de valores preenchidos automaticamente: */
                    closeAllLists();
                });
                a.appendChild(b);
              }
            }
        });
        /* executa a função quando determinada tecla é pressionada: */
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /* se a tecla de seta para baixo for pressionada, aumentar a variável currentFocus: */
              currentFocus++;
              /* e tornar o item atual destacado (focus/hover):*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*se a tecla de seta para baixo for pressionada, aumentar a variável currentFocus:*/
              currentFocus--;
              /* tornar item atual mais visivel*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /* se ENTER estiver pressionada, evita que o formulário seja enviado,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*e simula um clique no item ativo: */
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*function para classificar um item como ativo: */
          if (!x) return false;
          /* remove a classe ativa em todos os items: */
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /* adiciona a classe 'autocomplete-active': */
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /* function para remover a classe 'active' de todos os itens do autocomplete:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /* inibe todos os itens da lista do autocomplete,
            exceto o elemento(elmnt) que é passado no argumento: */
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /* executa uma função quando alguém clica no documento:v*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
    }
    /* passa a matriz de capitais como o segundo parâmetro da função autocomplete */
    autocomplete(document.getElementById("myInput"), autoCompleteCities);
}); 