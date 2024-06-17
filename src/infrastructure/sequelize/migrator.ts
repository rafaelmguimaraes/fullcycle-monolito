import { SequelizeStorage, Umzug } from "umzug"
import { Sequelize } from "sequelize-typescript"

export default class UmzugMigrator {
  private _migrator: Umzug<Sequelize>;
  private _seeder: Umzug<Sequelize>;

  constructor(sequelize: Sequelize) {
    this._migrator = new Umzug({
      migrations: { glob: ['migrations/*.ts', { cwd: __dirname }] },
      context: sequelize,
      storage: new SequelizeStorage({ sequelize }),
      logger: undefined,
    })
    this._seeder = new Umzug({
      migrations: { glob: ['seeders/*.ts', { cwd: __dirname }] },
      context: sequelize,
      storage: new SequelizeStorage({ sequelize }),
      logger: undefined,
    })
  }

  async up() {
    await this._migrator.up();
    await this._seeder.up();
  }

  async down() {
    await this._seeder.down();
    await this._migrator.down();
  }
}