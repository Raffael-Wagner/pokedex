const pokemonList = document.getElementById("pokemonList");
const filterType = document.getElementById("filterType");
const refreshButton = document.getElementById("refreshButton");

const maxRecords = 151;
const limit = 151;
let offset = 0;

/*Função para listar os Pokémon*/

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" onCLick="selectPokemon(${
    pokemon.number
  })">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

/*Código para aparecer as informações */

const selectPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const pokemon = await res.json();
  displayPopup(pokemon);
};

const displayPopup = (pokemon) => {
  const imagem = pokemon.sprites.other.home.front_default;
  const types = pokemon.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  const htmlString = `
  <div class = "popup"> 
  <div id="details">
  <li class="pokemon ${pokemon.type}">
  <span class="number">#${pokemon.id}</span>
  <span class="name">${pokemon.name}</span>
  <div class="detail">
  <ol class="types">
      ${pokemon.types
        .map((type) => `<li class="type ${type}">${type}</li>`)
        .join("")}
  </ol>
</div>
  <img id="pokemon-img" src="${imagem}"
           alt="${pokemon.name}">
           <div id="data">
           <h2>Estatísticas básicas</h2>
           <div id="stats">
           <div class="interna">
           ${pokemon.stats
             .map(
               (name_stats) => `<p class="${type}">${name_stats.stat.name}</p>`
             )
             .join("")}</div>
           <div class="stat-desc">${pokemon.stats
             .map(
               (base_stats) => `<p class="${type}">${base_stats.base_stat}</p>`
             )
             .join("")}</div>
             
 </div>
 <div class="statsHw">
 <p class="${type}">Height:${(pokemon.height / 10).toFixed(2)} m</p>
 <p class="${type}">Weight:${pokemon.weight / 10} kg</p>
 <div>
</li>
  <button id="closeBtn" onClick="closePopup()">Voltar</button>
  </div>
</div>
</div>
  `;
  pokemonList.innerHTML = htmlString + pokemonList.innerHTML;
  console.log(htmlString);
};

const closePopup = () => {
  const popup = document.querySelector(".popup");
  popup.parentElement.removeChild(popup);
};

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;

    if (filterType.value === "all") {
      loadMoreButton.style.display = "block";
    } else {
      loadMoreButton.style.display = "none";
    }
  });
}

loadPokemonItens(offset, limit);

/*Filtro pokémon por tipo*/

function getPokemonsByType(type) {
  if (type === "all") {
    return pokeApi.getPokemons(0, maxRecords);
  }

  return pokeApi.getPokemons(0, maxRecords).then((pokemonData) => {
    const filteredPokemons = pokemonData.filter((pokemon) =>
      pokemon.types.includes(type)
    );
    return filteredPokemons;
  });
}

filterType.addEventListener("change", () => {
  const selectedType = filterType.value;
  if (selectedType === "all") {
    pokemonList.innerHTML = "";
    loadPokemonItens(offset, limit);
    loadMoreButton.style.display = "block";
  } else {
    getPokemonsByType(selectedType, offset, maxRecords).then((pokemons) => {
      const newHtml = pokemons.slice(0, limit).map(convertPokemonToLi).join("");
      pokemonList.innerHTML = newHtml;
      if (pokemons.length < limit) {
        loadMoreButton.style.display = "none";
      } else {
        loadMoreButton.style.display = "block";
      }
    });
  }
});

/*Botão de refresh*/

refreshButton.addEventListener("click", () => {
  pokemonList.innerHTML = "";
  offset = 0;
  loadPokemonItens(offset, limit);
});
