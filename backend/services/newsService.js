import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Função para formatar os artigos antes de enviar para sumarização
const formatArticlesForSummarization = (articles) => {
  return articles
    .map(article => `Título: ${article.title}. ${article.content ? `Resumo: ${article.content}.` : ''}`)
    .join('\n\n');
};

// Função para ajustar o texto usando Hugging Face
const adjustTextWithHuggingFace = async (articles) => {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error("Chave da API do Hugging Face não encontrada!");
    }

    const modelName = 'facebook/bart-large-cnn'; // Modelo de sumarização
    let formattedText = formatArticlesForSummarization(articles); // Formata os artigos

    // ✅ Truncando o texto para no máximo 1024 caracteres antes de enviar para a API
    if (formattedText.length > 1024) {
      formattedText = formattedText.substring(0, 1024);
    }

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${modelName}`,
      {
        inputs: formattedText,
        parameters: {
          max_length: 250,   // 🔹 Definindo um limite máximo para o output
          min_length: 100,   // 🔹 Garantindo que o resumo tenha um tamanho mínimo
          do_sample: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        }
      }
    );

    return response.data[0]?.summary_text || formattedText;
  } catch (error) {
    console.error("Erro ao ajustar texto:", error.response ? error.response.data : error.message);
    throw new Error("Erro ao ajustar texto.");
  }
};

// Função para buscar a bio de uma pessoa/empresa usando a Wikipedia
const fetchBio = async (query) => {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await axios.get(url);

    if (response.data && response.data.extract) {
      return response.data.extract;
    } else {
      return "Informação não encontrada.";
    }
  } catch (error) {
    console.error("Erro ao buscar bio:", error.response ? error.response.data : error.message);
    return "Erro ao buscar informações.";
  }
};

// Função para buscar notícias no GNews
const fetchNews = async (query) => {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    throw new Error("Chave da API do GNews não encontrada!");
  }

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=pt&from=2025-03-23&to=2025-03-23&pageSize=30&page=1&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.articles;
  } catch (error) {
    console.error("Erro ao buscar notícias:", error.response ? error.response.data : error.message);
    throw new Error("Erro ao buscar notícias.");
  }
};

// Função para obter todas as informações relacionadas ao tema
const getTemaInfo = async (query) => {
  try {
    const articles = await fetchNews(query);  // Obter notícias
    const bioData = await fetchBio(query);    // Obter bio
    const summarizedText = await adjustTextWithHuggingFace(articles);  // Gerar resumo das notícias

    return {
      bio: bioData,
      summarizedText,
      articles
    };
  } catch (error) {
    console.error("Erro ao obter informações sobre o tema:", error.message);
    throw new Error("Erro ao obter informações sobre o tema.");
  }
};

export { getTemaInfo };
