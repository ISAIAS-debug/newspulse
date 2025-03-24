import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { getTemaInfo } from './services/newsService.js'; // Importa a função correta

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota para obter informações sobre o tema
app.get('/api/theme-info', async (req, res) => {
  const { query } = req.query; // Obtém a query enviada pelo frontend

  if (!query) {
    return res.status(400).json({ error: 'Query é obrigatória' }); // Valida se a query foi enviada
  }

  try {
    // Chama a função getTemaInfo passando apenas a query
    const data = await getTemaInfo(query);

    // Retorna os dados para o frontend
    res.status(200).json({
      articles: data.articles,
      prognosis: data.summarizedText,
      bio: data.bio
    });
  } catch (error) {
    console.error('Erro ao buscar informações do tema:', error);
    res.status(500).json({ error: 'Erro ao buscar informações' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
