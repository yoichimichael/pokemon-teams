const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main')
  
  fetch(TRAINERS_URL)
  .then( resp => resp.json())
  .then( json => {



    json.map((trainer) => {
      const trainerDiv = document.createElement("div")
      trainerDiv.className = "card"
      trainerDiv.dataset.id = trainer.id
      trainerDiv.innerHTML = `
        <p>${trainer.name}</p>
        <button class="add-pokemon" data-trainer-id="${trainer.id}">Add Pokemon</button>
        <ul class='pokemon-list'></ul>
      `


      main.appendChild(trainerDiv)
      const pokemonList = trainerDiv.querySelector('ul')
      const pokemons = trainer.pokemons 

      for(const pokemon of pokemons){
        let pokemonLi = document.createElement('li')
        pokemonLi.innerHTML = `
          ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
        `
        pokemonList.appendChild(pokemonLi)
      };
    });

    document.addEventListener('click', (event) => {
      const trainerUl = event.target.nextElementSibling

      if(event.target.className === 'add-pokemon'){
        if(trainerUl.children.length < 6){
          
          fetch(POKEMONS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify ({

    // needs to match ruby syntax
              trainer_id: `${event.target.dataset.trainerId}` 
            })
          })
          .then(resp => resp.json())
          .then(pokemon => {
            const pokemonLi = document.createElement('li')
            pokemonLi.innerHTML = `
            ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
            `
            trainerUl.appendChild(pokemonLi)
          });

        } else alert("You already have 6 Pokemon");
      } else if (event.target.className === 'release'){
          fetch(`${POKEMONS_URL}/${event.target.dataset.pokemonId}`, {
            method: 'DELETE'
          })
          .then(resp => resp.json())
          .then(pokemon => {
            event.target.parentElement.remove()
          })
        }
    });
    

  }); 
});
