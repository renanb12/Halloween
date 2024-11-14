// Importa os módulos necessários para configurar o servidor
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const SECRET_KEY = 'seu_segredo_aqui'; // Substitua por um segredo seguro para gerar tokens JWT

// Middleware para habilitar o CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(bodyParser.json()); // Middleware para processar o corpo das requisições em JSON

// Configura a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ajuste conforme necessário
  password: '', // Insira a senha se aplicável
  database: 'halloween' // Nome do banco de dados
});

// Conecta ao banco de dados e exibe mensagem de sucesso ou erro
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

// Rota para registrar usuários
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (name, email, password, maxScore, minScore, score) VALUES (?, ?, ?, 0, 0, 0)', 
  [name, email, hashedPassword], 
  (err, result) => {
      if (err) {
          res.status(500).send('Erro ao registrar');
          return;
      }
      res.status(201).send('Usuário registrado com sucesso');
  });
});



// Rota para login de usuários
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Obtém o email e senha do corpo da requisição

  // Consulta o usuário no banco de dados
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) throw err;

    // Verifica se o usuário existe e se a senha está correta
    if (result.length === 0 || !(await bcrypt.compare(password, result[0].password))) {
      return res.status(400).send('Email ou senha inválidos');
    }

    // Gera o token JWT
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' }); // Define validade de 1 hora
    res.json({ token }); // Retorna o token ao cliente
  });
});

// Middleware para verificar o token JWT nas requisições
const authenticateToken = (req, res, next) => {
  // Extrai o token do cabeçalho de autorização
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) return res.sendStatus(401); // Retorna 401 se não houver token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Retorna 403 se o token for inválido ou expirado
    req.user = user; // Armazena o email do usuário no objeto `req` para uso futuro
    next(); // Passa para a próxima função
  });
};

// Rota para obter dados do usuário logado
app.get('/user', authenticateToken, (req, res) => {
  db.query('SELECT name, email, maxScore, minScore, score FROM users WHERE email = ?', [req.user.email], (err, result) => {
      if (err) {
          res.status(500).send('Erro no servidor');
          return;
      }

      if (result.length === 0) {
          res.status(404).send('Usuário não encontrado');
          return;
      }

      // Retorna os dados do usuário
      res.json(result[0]);
  });
});


// Rota para alterar a senha do usuário
app.put('/user/password', authenticateToken, async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, req.user.email], (err, result) => {
      if (err) {
          res.status(500).send('Erro no servidor');
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).send('Usuário não encontrado');
          return;
      }

      res.send('Senha alterada com sucesso');
  });
});

// Rota para excluir a conta do usuário
app.delete('/user', authenticateToken, (req, res) => {
  db.query('DELETE FROM users WHERE email = ?', [req.user.email], (err, result) => {
      if (err) {
          res.status(500).send('Erro no servidor');
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).send('Usuário não encontrado');
          return;
      }

      res.send('Conta excluída com sucesso');
  });
});

app.post('/user/score', authenticateToken, (req, res) => {
  const { score } = req.body;

  db.query('SELECT maxScore, minScore FROM users WHERE email = ?', [req.user.email], (err, results) => {
      if (err) {
          res.status(500).send('Erro ao buscar pontuações');
          return;
      }

      if (results.length === 0) {
          res.status(404).send('Usuário não encontrado');
          return;
      }

      let { maxScore, minScore } = results[0];

      // Atualiza o maxScore se o score atual for maior
      if (score > maxScore) {
          maxScore = score;
      }

      // Atualiza o minScore se o score atual for menor (e minScore for diferente de zero)
      if ((score < minScore || minScore === 0) && score > 0) {
          minScore = score;
      }

      // Atualiza o score atual, maxScore e minScore no banco de dados
      db.query('UPDATE users SET score = ?, maxScore = ?, minScore = ? WHERE email = ?', 
      [score, maxScore, minScore, req.user.email], 
      (updateErr) => {
          if (updateErr) {
              res.status(500).send('Erro ao atualizar a pontuação');
              return;
          }

          res.send('Pontuação atualizada com sucesso');
      });
  });
});


// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});