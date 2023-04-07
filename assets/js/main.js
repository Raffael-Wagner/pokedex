const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const filterType = document.getElementById("filterType");
const refreshButton = document.getElementById("refreshButton");

const maxRecords = 151;
const limit = 151;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
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

loadMoreButton.addEventListener("click", (event) => {
  event.preventDefault();
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

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

refreshButton.addEventListener("click", () => {
  pokemonList.innerHTML = "";
  offset = 0;
  loadPokemonItens(offset, limit);
});
