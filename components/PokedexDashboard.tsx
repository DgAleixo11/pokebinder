"use client";

import { useEffect, useMemo, useState } from "react";
import { pokemonForms } from "@/data/pokemonForms";

type CollectionData = {
  selectedCard: string;
  cardImageUrl: string;
  ligaPokemonUrl: string;
  lowestPrice: number;
  owned: boolean;
};

type CollectionState = Record<number, CollectionData>;

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getInitialCollectionState(): CollectionState {
  return pokemonForms.reduce<CollectionState>((acc, pokemon) => {
    acc[pokemon.id] = {
      selectedCard: pokemon.selectedCard,
      cardImageUrl: pokemon.cardImageUrl,
      ligaPokemonUrl: pokemon.ligaPokemonUrl,
      lowestPrice: pokemon.lowestPrice,
      owned: pokemon.owned,
    };

    return acc;
  }, {});
}

export function PokedexDashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [formTypeFilter, setFormTypeFilter] = useState("todos");
  const [collection, setCollection] = useState<CollectionState>(() =>
    getInitialCollectionState()
  );

  useEffect(() => {
    const savedCollection = localStorage.getItem("pokebinder-collection");

    if (savedCollection) {
      setCollection(JSON.parse(savedCollection));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pokebinder-collection", JSON.stringify(collection));
  }, [collection]);

  function updatePokemonData(
    pokemonId: number,
    field: keyof CollectionData,
    value: string | number | boolean
  ) {
    setCollection((currentCollection) => ({
      ...currentCollection,
      [pokemonId]: {
        ...currentCollection[pokemonId],
        [field]: value,
      },
    }));
  }

  const mergedPokemonForms = useMemo(() => {
    return pokemonForms.map((pokemon) => ({
      ...pokemon,
      ...collection[pokemon.id],
    }));
  }, [collection]);

  const acquiredCards = mergedPokemonForms.filter(
    (pokemon) => pokemon.owned
  ).length;

  const missingCards = mergedPokemonForms.length - acquiredCards;

  const selectedCards = mergedPokemonForms.filter(
    (pokemon) => pokemon.selectedCard.trim() !== ""
  ).length;

  const totalCollectionValue = mergedPokemonForms.reduce(
    (total, pokemon) => total + Number(pokemon.lowestPrice || 0),
    0
  );

  const acquiredCollectionValue = mergedPokemonForms.reduce((total, pokemon) => {
    if (!pokemon.owned) return total;

    return total + Number(pokemon.lowestPrice || 0);
  }, 0);

  const missingCollectionValue = totalCollectionValue - acquiredCollectionValue;

  const completionPercentage =
    mergedPokemonForms.length > 0
      ? ((acquiredCards / mergedPokemonForms.length) * 100).toFixed(2)
      : "0.00";

  const formTypes = useMemo(() => {
    return Array.from(new Set(pokemonForms.map((pokemon) => pokemon.formType)));
  }, []);

  const filteredPokemon = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return mergedPokemonForms.filter((pokemon) => {
      const matchesSearch = pokemon.searchName.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "adquiridos" && pokemon.owned) ||
        (statusFilter === "faltantes" && !pokemon.owned) ||
        (statusFilter === "selecionados" &&
          pokemon.selectedCard.trim() !== "") ||
        (statusFilter === "nao-selecionados" &&
          pokemon.selectedCard.trim() === "");

      const matchesFormType =
        formTypeFilter === "todos" || pokemon.formType === formTypeFilter;

      return matchesSearch && matchesStatus && matchesFormType;
    });
  }, [search, statusFilter, formTypeFilter, mergedPokemonForms]);

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

        <section className="grid gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Total da coleção</p>
            <strong className="mt-2 block text-3xl">
              {mergedPokemonForms.length}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Selecionados</p>
            <strong className="mt-2 block text-3xl text-sky-400">
              {selectedCards}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Adquiridos</p>
            <strong className="mt-2 block text-3xl text-emerald-400">
              {acquiredCards}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Faltantes</p>
            <strong className="mt-2 block text-3xl text-red-400">
              {missingCards}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Completo</p>
            <strong className="mt-2 block text-3xl text-yellow-300">
              {completionPercentage}%
            </strong>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Valor estimado total</p>
            <strong className="mt-2 block text-2xl text-yellow-300">
              {formatCurrency(totalCollectionValue)}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Valor adquirido</p>
            <strong className="mt-2 block text-2xl text-emerald-400">
              {formatCurrency(acquiredCollectionValue)}
            </strong>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-400">Valor faltante</p>
            <strong className="mt-2 block text-2xl text-red-400">
              {formatCurrency(missingCollectionValue)}
            </strong>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900">
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5">
            <div>
              <h2 className="text-xl font-semibold">Minha Pokédex</h2>
              <p className="text-sm text-zinc-400">
                Selecione a carta desejada e marque check apenas quando você já
                possuir a carta.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="text"
                placeholder="Buscar Pokémon..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-yellow-400"
              >
                <option value="todos">Todos os status</option>
                <option value="adquiridos">Adquiridos</option>
                <option value="faltantes">Faltantes</option>
                <option value="selecionados">Com carta selecionada</option>
                <option value="nao-selecionados">Sem carta selecionada</option>
              </select>

              <select
                value={formTypeFilter}
                onChange={(event) => setFormTypeFilter(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm outline-none focus:border-yellow-400"
              >
                <option value="todos">Todos os tipos</option>
                {formTypes.map((formType) => (
                  <option key={formType} value={formType}>
                    {formType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1300px] border-collapse text-left">
              <thead className="bg-zinc-950 text-sm text-zinc-400">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Pokémon/Forma</th>
                  <th className="px-5 py-4">Tipo</th>
                  <th className="px-5 py-4">Carta</th>
                  <th className="px-5 py-4">Liga Pokémon</th>
                  <th className="px-5 py-4">Imagem</th>
                  <th className="px-5 py-4">Preço</th>
                  <th className="px-5 py-4">Check</th>
                </tr>
              </thead>

              <tbody>
                {filteredPokemon.map((pokemon) => (
                  <tr key={pokemon.id} className="border-t border-zinc-800">
                    <td className="px-5 py-4 text-zinc-400">
                      {String(pokemon.id).padStart(4, "0")}
                    </td>

                    <td className="px-5 py-4 font-medium">{pokemon.name}</td>

                    <td className="px-5 py-4">
                      <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
                        {pokemon.formType}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="text"
                        value={pokemon.selectedCard}
                        onChange={(event) =>
                          updatePokemonData(
                            pokemon.id,
                            "selectedCard",
                            event.target.value
                          )
                        }
                        placeholder="Nome da carta"
                        className="w-64 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="url"
                        value={pokemon.ligaPokemonUrl}
                        onChange={(event) =>
                          updatePokemonData(
                            pokemon.id,
                            "ligaPokemonUrl",
                            event.target.value
                          )
                        }
                        placeholder="Link da Liga"
                        className="w-64 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="group relative">
                        <input
                          type="url"
                          value={pokemon.cardImageUrl}
                          onChange={(event) =>
                            updatePokemonData(
                              pokemon.id,
                              "cardImageUrl",
                              event.target.value
                            )
                          }
                          placeholder="URL da imagem"
                          className="w-64 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                        />

                        {pokemon.cardImageUrl && (
                          <div className="pointer-events-none absolute left-0 top-12 z-20 hidden rounded-xl border border-zinc-700 bg-zinc-950 p-3 shadow-2xl group-hover:block">
                            <img
                              src={pokemon.cardImageUrl}
                              alt={pokemon.selectedCard || pokemon.name}
                              className="h-80 w-auto rounded-lg object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={pokemon.lowestPrice || ""}
                        onChange={(event) =>
                          updatePokemonData(
                            pokemon.id,
                            "lowestPrice",
                            Number(event.target.value)
                          )
                        }
                        placeholder="0,00"
                        className="w-28 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-yellow-400"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={pokemon.owned}
                        onChange={(event) =>
                          updatePokemonData(
                            pokemon.id,
                            "owned",
                            event.target.checked
                          )
                        }
                        className="h-5 w-5 accent-yellow-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPokemon.length === 0 && (
              <div className="p-8 text-center text-zinc-400">
                Nenhum Pokémon encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}