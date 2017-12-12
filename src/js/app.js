axios.get("https://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='rio de janeiro, rj') and u='c'&format=json")
    .then(function (response) {
        var forecast = response.data.query.results.channel.item.forecast[0];
        var high = forecast.high;
        var low = forecast.low;
    })
    .catch(function (error) {
        console.log("error");
    });