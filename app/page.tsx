const stats = {
  total: 1200,
  acquired: 145,
  selected: 210,
};

const missing = stats.total - stats.acquired;
const percentage = ((stats.acquired / stats.total) * 100).toFixed(2);

const samplePokemon = [
  {
    dex: 1,
    name: "Bulbasaur",
    selectedCard: "Bulbasaur 001/165",
    price: "R$ 1,50",
    owned: true,
  },
  {
    dex: 3,
    name: "Mega Venusaur",
    selectedCard: "Ainda não selecionado",
    price: "-",
    owned: false,
  },
  {
    dex: 6,
    name: "Charizard",
    selectedCard: "Charizard 025/185",
    price: "R$ 8,90",
    owned: true,
  },
  {
    dex: 6,
    name: "Mega Charizard X",
    selectedCard: "Ainda não selecionado",
    price: "-",
    owned: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-sm text-yellow-300">
            Pokémon TCG Collection Tracker
          </span>

          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              PokéBinder
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Controle sua coleção de cartas Pokémon por Pokédex, formas
              regionais, mega evoluções, gigantamax e variações especiais.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Total da coleção</p>
            <strong className="mt-2 block text-3xl">{stats.total}</strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Cards adquiridos</p>
            <strong className="mt-2 block text-3xl text-emerald-400">
              {stats.acquired}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Cards faltantes</p>
            <strong className="mt-2 block text-3xl text-red-400">
              {missing}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Completo</p>
            <strong className="mt-2 block text-3xl text-yellow-300">
              {percentage}%
            </strong>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Minha Pokédex</h2>
              <p className="text-sm text-zinc-400">
                Selecione a carta desejada e marque check apenas quando você já
                possuir a carta.
              </p>
            </div>

            <input
              type="text"
              placeholder="Buscar Pokémon..."
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead className="bg-zinc-950 text-sm text-zinc-400">
                <tr>
                  <th className="px-5 py-4"># Dex</th>
                  <th className="px-5 py-4">Pokémon/Forma</th>
                  <th className="px-5 py-4">Carta selecionada</th>
                  <th className="px-5 py-4">Menor preço</th>
                  <th className="px-5 py-4">Check</th>
                </tr>
              </thead>

              <tbody>
                {samplePokemon.map((pokemon) => (
                  <tr
                    key={`${pokemon.dex}-${pokemon.name}`}
                    className="border-t border-zinc-800"
                  >
                    <td className="px-5 py-4 text-zinc-400">
                      {String(pokemon.dex).padStart(3, "0")}
                    </td>

                    <td className="px-5 py-4 font-medium">{pokemon.name}</td>

                    <td className="px-5 py-4 text-zinc-300">
                      {pokemon.selectedCard}
                    </td>

                    <td className="px-5 py-4 text-zinc-300">
                      {pokemon.price}
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={pokemon.owned}
                        readOnly
                        className="h-5 w-5 accent-yellow-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}