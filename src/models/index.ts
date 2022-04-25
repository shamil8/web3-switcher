import { Sequelize, } from 'sequelize-typescript';
import { ParserInfo, } from './ParserInfo';
import { NodeProvider, } from './NodeProvider';

export async function switcherDatabase(dbLink: string, logging = false, sync = true)
  : Promise<{ sequelize: Sequelize, }> {
  const sequelize: Sequelize = new Sequelize(dbLink, {
    dialect: 'postgres',
    models: [
      ParserInfo,
      NodeProvider
    ],
    logging,
  });

  if (sync) {
    await sequelize.sync();
  }

  return { sequelize, };
}

export { ParserInfo, NodeProvider, };

export default switcherDatabase;
