#/bin/sh

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate --env test