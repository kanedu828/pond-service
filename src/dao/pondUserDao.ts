interface PondUserColumns {
  id?: number;
  email?: string;
  google_id?: string;
  username?: string;
  exp?: number;
  location?: string;
}

const allColumns = ['id', 'email', 'google_id', 'username', 'exp', 'location'];

class PondUserDao {
  // Knex db instance
  readonly db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getPondUser(key: PondUserColumns) {
    const pondUser = await this.db('pond_user').where(key).first();
    return pondUser;
  }

  async insertPondUser(columns: PondUserColumns) {
    const pondUser = await this.db('pond_user').returning(allColumns).insert(columns);
    return pondUser[0];
  }

  async updatePondUser(key: PondUserColumns, columns: PondUserColumns) {
    const pondUser = await this.db('pond_user').returning(allColumns).where(key).update(columns);
    return pondUser[0];
  }

  async incrementPondUserExp(id: number, inc: number) {
    const pondUser = await this.db('pond_user')
      .where({
        id
      })
      .increment('exp', inc)
      .returning(allColumns);
    return pondUser[0];
  }
}

export default PondUserDao;
