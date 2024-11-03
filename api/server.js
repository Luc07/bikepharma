const express = require('express');
const cors = require('cors');
const locacoesRoutes = require('./routes/locacoes');
const bicicletasRoutes = require('./routes/bicicletas');
const clientesRoutes = require('./routes/clientes');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const port = 3006;

app.use(cors());
app.use(express.json());

app.use('/api/locacoes', locacoesRoutes);

app.use('/api', bicicletasRoutes);

app.use('/api', clientesRoutes);

app.use('/api', usuariosRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
