const section_1 = document.createElement("section");
const header_search = document.querySelector(".header-search");
const searchList = document.querySelector(".searchlist");
const closeBtn = document.querySelector(".close");
section_1.setAttribute("id", "section-1");
document.querySelector("#main").appendChild(section_1);
const weight_attr = document.querySelector(".weight-attr");
const height_attr = document.querySelector(".height-attr");
const ability_attr = document.querySelector(".ability-attr");
const move_attr = document.querySelector(".move-attr");
let search_keyword = "";

const pokemon_names = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=600");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

pokemon_names()
  .then((data) => data.results.map((e) => e.name))
  .then((poke_name) => {
    for (let i = 1; i <= 600; i++) {
      const pokemon_detail = document.createElement("div");
      pokemon_detail.classList.add("pokemon-detail");
      const pokemon_image = document.createElement("img");
      pokemon_image.setAttribute("image-id", i);
      pokemon_image.classList.add("pokemon-image");
      pokemon_image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
      pokemon_detail.appendChild(pokemon_image);
      const pokemon_name = document.createElement("h3");
      const text_node = document.createTextNode(poke_name[i - 1]);
      pokemon_name.appendChild(text_node);
      pokemon_detail.appendChild(pokemon_name);
      section_1.appendChild(pokemon_detail);
    }
    header_search.addEventListener("input", function (e) {
      if (e.inputType === "deleteContentBackward") {
        search_keyword = search_keyword.slice(0, -1);
      } else {
        search_keyword += e.data;
      }
      if (search_keyword) searchForPokemonByNames(search_keyword, poke_name);
      else document.querySelector(".searchlist").style.display = "none";
    });
    return poke_name;
  })
  .then((names) => {
    searchPokemon(names);
  });

function searchPokemon(names) {
  section_1.addEventListener("click", (event) => {
    event.stopPropagation();
    if (event.target.nodeName == "IMG") {
      let pokeID = event.target.getAttribute("image-id");
      document.querySelector(".image-searched").src = "";
      searchedPokemon(pokeID, names[pokeID - 1]);
    }
  });
}

function searchedPokemon(pokeId, name) {
  header_search.value = "";
  search_keyword = "";
  document.querySelector(
    ".image-searched"
  ).src = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokeId}.svg`;
  document.querySelector("#section-2").style.display = "block";
  retrieveAttributes(pokeId).then((data) => {
    const pokeAttribute = {
      ability: "",
      height: "",
      weight: "",
      move: ""
    };
    pokeAttribute.ability = data["abilities"].map(
      (x) => x["ability"]["name"]
    )[1];
    if (!pokeAttribute.ability) pokeAttribute.ability = "N/A";
    pokeAttribute.weight = data.weight;
    pokeAttribute.height = data.height;
    pokeAttribute.move = data.moves.map((x) => x["move"]["name"])[0];
    document.querySelector(".pokemon-name").innerText = name;
    weight_attr.removeChild(weight_attr.lastChild);
    weight_attr.appendChild(ElementCreation("p", pokeAttribute.weight));
    height_attr.removeChild(height_attr.lastChild);
    height_attr.appendChild(ElementCreation("p", pokeAttribute.height));
    ability_attr.removeChild(ability_attr.lastChild);
    ability_attr.appendChild(ElementCreation("p", pokeAttribute.ability));
    move_attr.removeChild(move_attr.lastChild);
    move_attr.appendChild(ElementCreation("p", pokeAttribute.move));
  });
  closeBtn.addEventListener("click", () => {
    document.querySelector("#section-2").style.display = "none";
  });
}

function ElementCreation(tagtype, textNode) {
  let tag = document.createElement(tagtype);
  let textnode = document.createTextNode(textNode);
  tag.appendChild(textnode);
  return tag;
}

function searchForPokemonByNames(pokename, pokeNames) {
  const searchList = document.querySelector(".searchlist");
  searchList.style.display = "none";
  if (pokename) {
    searchList.style.display = "block";
    displaySearchList(pokename, pokeNames);
  } else {
    searchList.style.display = "none";
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function displaySearchList(pokename, pokeNames) {
  let search_list_elements = pokeNames
    .filter((p) => p.startsWith(pokename.toLowerCase()))
    .sort();
  const search_list = document.querySelector(".searchlist");
  removeAllChildNodes(search_list);

  search_list_elements.forEach((x) => {
    const list_element = document.createElement("li");
    list_element.classList.add("list-item");
    let textnode = document.createTextNode(x);
    list_element.appendChild(textnode);
    search_list.appendChild(list_element);
  });

  search_list.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.nodeName == "LI") {
      search_list.style.display = "none";
      let pokeId = pokeNames.lastIndexOf(e.target.innerText);
      document.querySelector(".image-searched").src = "";
      searchedPokemon(pokeId + 1, pokeNames[pokeId]);
    }
  });
}

const retrieveAttributes = async (pokeId) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};
