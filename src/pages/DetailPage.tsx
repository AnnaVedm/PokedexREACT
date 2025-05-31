import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Ping } from '@uiball/loaders';
import { DETAIL_URL } from '../utils/constants.ts';

axios.defaults.baseURL = DETAIL_URL;

const typeColors: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const DetailPage = () => {
  const { id: pokemonID } = useParams<string>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/ability/${pokemonID}`);
        const { effect_entries, flavor_text_entries, names, generation: { name } } = data;
        setData({ effect_entries, flavor_text_entries, names, name });
      } catch (e) {
        toast.error('Что-то пошло не так! Пожалуйста, перезагрузите страницу.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [pokemonID]);

  const mainColor = data?.name && typeColors[data.name.toLowerCase()] 
    ? typeColors[data.name.toLowerCase()] 
    : '#6B7280'; // fallback gray

  return (
    <main className="max-w-4xl mx-auto p-8 bg-gradient-to-tr from-gray-100 to-white min-h-screen">
      <Link
        to="/"
        className="inline-block mb-8 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
      >
        ← Назад
      </Link>

      {isLoading ? (
        <div className="flex justify-center mt-20">
          <Ping size={60} speed={2} color={mainColor} />
        </div>
      ) : data ? (
        <article 
          className="bg-white rounded-xl shadow-2xl p-8 grid grid-cols-1 gap-10"
          style={{ borderTop: `8px solid ${mainColor}` }}
        >
          <h1 
            className="text-4xl font-extrabold text-center text-gray-900 mb-6"
            style={{ color: mainColor }}
          >
            {data?.names[7]?.name || 'Unknown'}
          </h1>

          <div className="flex flex-col items-center space-y-6">
            <img
              className="w-44 h-44 rounded-xl shadow-lg"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonID}.png`}
              alt={data?.names[7]?.name || 'Pokemon'}
              loading="lazy"
              width={176}
              height={176}
            />

            <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-700">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                <h2 className="font-semibold mb-3 text-xl text-gray-800">Поколение</h2>
                <p className="text-lg font-medium" style={{ color: mainColor }}>
                  {data?.name || 'Нет данных'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                <h2 className="font-semibold mb-3 text-xl text-gray-800">Эффект</h2>
                <p className="text-base">{data?.effect_entries[1]?.short_effect || 'Нет данных'}</p>
              </div>

              <div className="sm:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                <h2 className="font-semibold mb-3 text-xl text-gray-800">Описание способности</h2>
                <p className="text-base leading-relaxed">{data?.flavor_text_entries[0]?.flavor_text || 'Нет данных'}</p>
              </div>
            </section>
          </div>
        </article>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-20">Информация не найдена.</p>
      )}
    </main>
  );
};

export default DetailPage;
