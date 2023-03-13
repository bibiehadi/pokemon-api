$.ajax({
  url: "https://pokeapi.co/api/v2/pokemon/?limit=10",
  success: function (res) {
    $.each(res.results, function (key, value) {
      $.ajax({
        url: value.url,
        success: function (data) {
          let myCol = $('<div class="col-sm-6 col-md-3 pb-3"></div>');
          let type = "";
          $.each(data.types, function (key, value) {
            type +=
              "<span class='text-dark badge rounded-pill border " +
              value.type.name +
              "'>" +
              value.type.name +
              "</span> ";
          });
          let myPanel = $(
            '<div id="pokecard' +
              data.id +
              '" class="card bg-costum rounded-4 shadow-lg p-3 mb-5 ' +
              data.types[0].type.name +
              '" onClick="getPokemon(' +
              data.id +
              ')"  data-bs-toggle="modal" data-bs-target="#modalPokemon">' +
              '<div class="shadow-lg mb-1 poke-img"> <img src="' +
              data.sprites.other["official-artwork"].front_default +
              '" class="card-img-top" alt="..."/></div>' +
              '<div class="card-body text-center">' +
              "<span>#" +
              data.id +
              "</span>" +
              '<h5 class="card-title">' +
              capital(data.name) +
              "</h5>" +
              type +
              "</div>" +
              "</div>"
          );
          myPanel.appendTo(myCol);
          myCol.appendTo("#pokemons");
        },
      });
    });
  },
});

const pokemonStats = document.getElementById("pokemonStats");

function getPokemon(id) {
  let url = "https://pokeapi.co/api/v2/pokemon/" + id;
  $.ajax({
    url: url,
    success: function (res) {
      const statsLabel = res.stats.map((stat) => stat.stat.name.toUpperCase());
      statsLabel[3] = "SP-ATK";
      statsLabel[4] = "SP-DEF";
      const statsData = res.stats.map((stat) => stat.base_stat);
      let type = "";
      $.each(res.types, function (key, value) {
        type +=
          "<span class='text-dark badge rounded-pill border " +
          value.type.name +
          "'>" +
          value.type.name +
          "</span> ";
      });
      let abilities = "";
      $.each(res.abilities, function (key, value) {
        abilities +=
          "<span class='text-dark badge rounded-pill border " +
          res.types[0].type.name +
          "'>" +
          value.ability.name +
          "</span> ";
      });
      const data = {
        labels: statsLabel,
        datasets: [
          {
            data: statsData,
          },
        ],
      };

      document
        .getElementById("modal-content")
        .classList.add(res.types[0].type.name);
      console.log(res);
      document.getElementById("modal-img").src =
        res.sprites.other["official-artwork"].front_default;
      $("#poke-name").html(capital(res.name));
      $("#modal-height").html(res.height / 10 + " meter");
      $("#modal-weight").html(res.weight / 10 + " Kg");
      $("#modal-type").html(type);
      $("#modal-abilities").html(abilities);
      strengthsWeakness(res.types[0].type.url);

      const radarChart = new Chart(pokemonStats, {
        type: "radar",
        data: data,
        options: {
          scale: {
            beginAtZero: true,
            min: 0,
          },
          plugins: {
            legend: false,
          },
        },
      });
      $("#modalPokemon").on("hidden.bs.modal", function () {
        radarChart.destroy();
      });
    },
  });
}

function capital(word) {
  return word[0].toUpperCase() + word.substring(1);
}

function strengthsWeakness(link) {
  $.ajax({
    url: link,
    success: function (res) {
      let weakness = "";
      let strengths = "";
      $.each(res.damage_relations.double_damage_from, function (key, value) {
        weakness +=
          "<span class='text-dark badge rounded-pill border'>" +
          value.name +
          "</span> ";
      });
      $.each(res.damage_relations.double_damage_to, function (key, value) {
        strengths +=
          "<span class='text-dark badge rounded-pill border'>" +
          value.name +
          "</span> ";
      });
      $("#modal-weakness").html(weakness);
      $("#modal-strengths").html(strengths);
    },
  });
}
// chart
