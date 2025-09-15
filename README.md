# AMVV Frontend

## Desarrollo Normal (Sin Docker)
npm install
npm start

# Eslint Comando

npx eslint nombre del archivo --fix

# ejemplo

npx eslint src/pages/Partidos/RegistrarResultado.js --fix

# Opcional

npx prettier --write src/pages/Partidos/PartidoDetalle.js

# DOCKER

# Primera vez
docker-compose up --build

# Iniciar  
docker-compose up

# Detener
docker-compose down

# Ver logs
docker-compose logs -f



