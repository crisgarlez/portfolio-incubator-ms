import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    app: {
      port: process.env.PORT,
      monsterTypesEndpoint: process.env.MONSTER_TYPES_ENDPOINT,
    },
    database: {
      DatabaseUri: process.env.DATABASE_URL,
    },
  };
});
