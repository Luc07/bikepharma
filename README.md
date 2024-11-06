# Bikepharma 🚲

**Bikepharma** é uma aplicação simples e intuitiva desenvolvida para gerenciar locações de bicicletas. Criada para uso interno da empresa, a aplicação visa facilitar o controle de locações e tornar o processo de locação mais eficiente e organizado, além de reforçar o compromisso com a saúde e o bem-estar da comunidade.

## Sobre o Projeto

O projeto **Bikepharma** foi desenvolvido para facilitar a administração de locações de bicicletas pela Redepharma. Ele permite registrar e monitorar locações, imprimir termos de uso e responsabilidade para o cliente assinar antes da locação, e emitir cupons de finalização ao término da locação. A aplicação tem como objetivo incentivar a saúde e bem-estar, além de contribuir com uma causa social.

## Funcionalidades

- **Registro de Locações**: Controle completo sobre o status das bicicletas alugadas.
- **Impressão de Termo de Aceite**: Emissão de um termo de uso e responsabilidade para assinatura do cliente antes da locação.
- **Emissão de Cupom de Finalização**: Geração de um recibo no final da locação, que pode ser entregue ao cliente como confirmação.

## Tecnologias Utilizadas

- **Frontend**: Next.js (React)
- **Backend**: Node.js (Express)
- **Banco de Dados**: MySQL
- **Containerização**: Docker e Docker Compose para gerenciamento de ambientes

## Pré-requisitos

- **Docker** e **Docker Compose** instalados no sistema.
- **Node.js** e **NPM** (se for rodar sem Docker).
- Configuração de um banco de dados MySQL.

## Instalação

```bash
git clone https://github.com/Luc07/bikepharma.git
cd bikepharma
docker-compose up --build
