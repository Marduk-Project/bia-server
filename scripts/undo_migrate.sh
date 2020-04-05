#/bin/sh

npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo --env test