import { LineWobble } from '@uiball/loaders';
import { Link } from 'react-router-dom';

interface Pokemon {
  id: string;
  name: string;
  pokemonId: string;
  type: string;
  color: string;
}

interface IListProps {
  loading: boolean;
  pokemons: Pokemon[];
}

const List = ({ loading, pokemons }: IListProps) => {
  if (loading) {
    return (
      <div className="grid place-items-center min-h-[200px]">
        <LineWobble size={100} lineWeight={5} speed={1.75} color="black" />
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        Покемоны не найдены.
      </p>
    );
  }

  return (
    <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto w-full">
      {pokemons.map(({ id, name, pokemonId, type, color }) => (
        <li
          key={id}
          className="bg-white border-2 rounded overflow-hidden shadow hover:shadow-lg transition-shadow duration-200"
        >
          <Link to={`detail/${id}`} className="block">
            <div
              className="flex justify-center p-3"
              style={{ backgroundColor: color }}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={name}
                loading="lazy"
                className="w-24 h-24"
              />
            </div>
            <div className="p-4 text-center space-y-1">
              <span className="bg-neutral-400 text-white rounded-full px-3 py-1 text-sm font-semibold inline-block">
                #{pokemonId}
              </span>
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="font-semibold">
                Type: <span className="capitalize">{type}</span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default List;
