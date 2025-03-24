import axios from 'axios';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query é obrigatória' });
  }

  try {
    // Fazendo a requisição ao backend para buscar informações sobre o tema
    const response = await axios.get(`http://localhost:3000/api/theme-info`, {
      params: { query }  // Passando a query como parâmetro na URL
    });

    const data = response.data;

    // Retornando os dados recebidos do backend
    res.status(200).json({
      articles: data.articles,
      prognosis: data.prognosis,  // Resumo gerado
      bio: data.bio  // Bio gerada
    });
  } catch (error) {
    console.error('Erro ao buscar dados do tema:', error);
    // Respondendo com erro genérico caso algo dê errado
    res.status(500).json({ error: 'Erro ao buscar informações' });
  }
}
