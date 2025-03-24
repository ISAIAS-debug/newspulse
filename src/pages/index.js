import { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const Home = () => {
  const [news, setNews] = useState([]);
  const [prognosis, setPrognosis] = useState("");
  const [query, setQuery] = useState("");
  const [bio, setBio] = useState("");
  const [socialMetrics, setSocialMetrics] = useState({
    instagram: null,
    facebook: null,
    linkedin: null,
    x: null,
    googleSearch: null
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchNewsAndPrognosis = async () => {
    if (!query) return;

    try {
      const response = await axios.get('http://localhost:3000/api/theme-info', {
        params: { query }
      });

      const data = response.data;

      if (!response.status === 200) {
        throw new Error(data?.error || "Erro desconhecido ao buscar notícias.");
      }

      setNews(data.articles);
      setPrognosis(data.prognosis);
      setBio(data.bio);

      // Simulando a coleta de métricas
      const instagramValue = Math.random() * 100;
      const facebookValue = Math.random() * 100;
      const linkedinValue = Math.random() * 100;
      const xValue = Math.random() * 100;
      const googleSearchValue = Math.random() * 100;

      setSocialMetrics({
        instagram: instagramValue,
        facebook: facebookValue,
        linkedin: linkedinValue,
        x: xValue,
        googleSearch: googleSearchValue
      });
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setPrognosis("Erro ao buscar informações.");
    }
  };

  return (
    <div className="w-full h-screen p-6 bg-white shadow-lg">
      <div className="w-full flex justify-between items-center">
      <h1 className="text-3xl font-bold text-blue-500 flex items-center space-x-2">
  <img src="logo.png" alt="PulseNews" className="w-70 h-16" /> {/* Ajuste as dimensões conforme necessário */}
</h1>
      </div>

      <h1 className="text-2xl flex justify-center font-semibold text-gray-800 mb-4">Últimas Notícias e Resumo da Semana</h1>

      <div className="w-full flex justify-center mb-6">
  <div className="w-1/2">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Digite sua consulta"
      className="w-full px-4 py-2 border rounded-md"
    />
    <button
      onClick={fetchNewsAndPrognosis}
      className="w-[20%] mt-2 bg-blue-500 text-white py-2 rounded-md mx-auto block"
    >
      Buscar
    </button>
  </div>
</div>

      {/* Cards grandes para Resumo, Bio e Métricas de Mídias Sociais */}
      <div className="flex w-full gap-6 mb-6">
        {/* Card de Resumo de Hoje */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Resumo de hoje</h2>
          <p className="text-gray-700">{prognosis}</p>
        </div>

        {/* Card de Métricas de Mídias Sociais */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">  Sobre o Tema em Mídias Sociais</h2>
          <ul className="list-none">
            <li>Instagram: {socialMetrics.instagram?.toFixed(2)}%</li>
            <li>Facebook: {socialMetrics.facebook?.toFixed(2)}%</li>
            <li>LinkedIn: {socialMetrics.linkedin?.toFixed(2)}%</li>
            <li>X: {socialMetrics.x?.toFixed(2)}%</li>
            <li>Google Search: {socialMetrics.googleSearch?.toFixed(2)}%</li>
          </ul>
        </div>

        {/* Card de Bio do Tema */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Bio</h2>
          <p className="text-gray-700">{bio}</p>
        </div>
      </div>

      {/* Cards das notícias */}
      <div className="mt-6 w-full flex overflow-x-auto gap-4">
        {news.slice(0, 10).map((article, index) => (
          <div key={index} className="flex-shrink-0 w-40 h-40 bg-white rounded-lg shadow-md flex flex-col justify-between p-4">
            <h3 className="font-semibold text-sm text-gray-800 truncate">{article.title}</h3>
            <p className="text-xs text-gray-600 flex-1 overflow-hidden overflow-ellipsis">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-xs"
            >
              Leia mais
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
