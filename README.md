# Controle de Estoque — Fullstack TypeScript (React + Node + Prisma + MySQL)

## Configuração rápida

Banco MySQL configurado no arquivo `server/.env` com:
DATABASE_URL=mysql://Mauricio.terto:@localhost:3306/estoque_gtsnet

### Rodar backend
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

### Rodar frontend
cd client
npm install
npm run dev
