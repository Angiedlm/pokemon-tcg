const container = document.getElementById("pokemon-container");
const buscador = document.getElementById("buscador");

let pokemones = [];

async function obtenerPokemon(){

    try{

        const respuesta = await fetch(
            "https://pokeapi.co/api/v2/pokemon?limit=151"
        );

        const data = await respuesta.json();

        const promesas = data.results.map(async(pokemon)=>{
            const res = await fetch(pokemon.url);
            return await res.json();
        });

        pokemones = await Promise.all(promesas);

        mostrarPokemon(pokemones);

    }catch(error){
        console.log(error);
        container.innerHTML =
        "<h3 class='text-danger text-center'>Error al cargar datos</h3>";
    }
}

function mostrarPokemon(lista){

    container.innerHTML = "";

    lista.forEach(info=>{

        const tipo = info.types[0].type.name;

       const habilidades = info.abilities
    .map(habilidad =>
        `<li>${habilidad.ability.name}</li>`
    )
    .join("");

        container.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3">

                <div
    class="card-pokemon"
    onclick="mostrarDetalle(${info.id})">

                    <div class="top-card">

    <span>
        #${info.id}
    </span>

    <span class="text-capitalize">
        ${info.name}
    </span>

    <span>
        HP ${info.stats[0].base_stat}
    </span>

</div>

                    <img
                        src="${info.sprites.other["official-artwork"].front_default}"
                        class="img-card p-2"
                    >

                    <div class="text-center mt-2">

                        <span class="tipo ${tipo}">
                            ${tipo}
                        </span>

                    </div>

                    <div class="habilidades">

                        <strong>habilidades</strong>

                        <ul class="mb-0 mt-2">
                            ${habilidades}
                        </ul>

                    </div>

                </div>

            </div>
        `;
    });
}
function mostrarDetalle(id){

    const pokemon =
        pokemones.find(p => p.id === id);

    document.getElementById(
        "modalTitle"
    ).innerText = pokemon.name;

    document.getElementById(
        "modalBody"
    ).innerHTML = `

        <img
            src="${pokemon.sprites.other["official-artwork"].front_default}"
            class="img-fluid mb-3">

        <p><strong>HP:</strong>
        ${pokemon.stats[0].base_stat}</p>

        <p><strong>Altura:</strong>
        ${pokemon.height}</p>

        <p><strong>Peso:</strong>
        ${pokemon.weight}</p>

        <p><strong>Habilidades:</strong></p>

        <ul>
            ${
                pokemon.abilities
                    .map(a =>
                    `<li>${a.ability.name}</li>`)
                    .join("")
            }
        </ul>
    `;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                "pokemonModal"
            )
        );

    modal.show();
}
buscador.addEventListener("keyup", ()=>{

    const texto = buscador.value.toLowerCase();

    const filtrados = pokemones.filter(p =>

    p.name.includes(texto) ||

    p.id.toString().includes(texto)

);

    mostrarPokemon(filtrados);
});

obtenerPokemon();
