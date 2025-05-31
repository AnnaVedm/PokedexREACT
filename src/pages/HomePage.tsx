import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { COLORS, HOME_URL, LIMIT } from '../utils/constants.ts';

interface Pokemon {
  id: string;
  name: string;
  pokemonId: string;
  type: string;
  color: string;
}

interface PokemonData {
  id: number;
  name: string;
  types: Record<
    number,
    {
      slot: number;
      type: { name: string; url: string };
    }
  >;
}

const perPageCount = 10;

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

const fetchPokemon = async (id: number): Promise<Pokemon> => {
  const { data: pokeData } = await axios.get<PokemonData>(`${HOME_URL}${id}`);
  const types = Object.values(pokeData.types).map(({ type }) => type.name);
  const mainType = Object.keys(COLORS).find(type => types.includes(type)) || 'normal';

  return {
    id: pokeData.id.toString(),
    name: capitalize(pokeData.name),
    pokemonId: pokeData.id.toString().padStart(3, '0'),
    type: mainType,
    color: COLORS[mainType],
  };
};

const HomePage = () => {
  const [data, setData] = useState<Pokemon[]>(() => {
    const stored = localStorage.getItem('pokedex');
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data.length === 0) {
      setLoading(true);
      (async () => {
        try {
          const promises = [];
          for (let i = 1; i <= LIMIT; i++) {
            promises.push(fetchPokemon(i));
          }
          const pokemons = await Promise.all(promises);
          setData(pokemons);
          localStorage.setItem('pokedex', JSON.stringify(pokemons));
        } catch (error) {
          toast.error('Что-то пошло не так...');
          console.error(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [data.length]);

  const totalPages = Math.ceil(data.length / perPageCount);
  const paginatedData = data.slice((currentPage - 1) * perPageCount, currentPage * perPageCount);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokédex</h1>

      {loading ? (
        <p className="text-center text-gray-700">Загрузка...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {paginatedData.map(({ id, name, pokemonId, type, color }) => (
              <Link
                to={`/detail/${id}`}
                key={id}
                className="rounded-lg shadow-md p-4 flex flex-col items-center bg-white border-2 hover:scale-105 transition-transform"
                style={{ borderColor: color }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={name}
                  className="w-20 h-20 mb-2"
                  loading="lazy"
                />
                <h2 className="font-semibold text-lg">{name}</h2>
                <p className="text-sm text-gray-600">#{pokemonId}</p>
                <span
                  className="mt-1 px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: color }}
                >
                  {type}
                </span>
              </Link>
            ))}
          </div>

          <nav className="flex justify-center mt-8 space-x-2" aria-label="Pagination">
            <button
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Предыдущая
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border-gray-300'
                }`}
                onClick={() => setCurrentPage(i + 1)}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Следующая
            </button>
          </nav>
        </>
      )}
    </main>
  );
};

export default HomePage;
