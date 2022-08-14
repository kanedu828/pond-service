interface FishColumns {
  id?: number;
  fish_id?: number;
  length?: number;
}

const allColumns = ['length', 'fish_id', 'created_at', 'updated_at'];

class FishDao {
  // Knex db instance
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getFish(key: FishColumns) {
    const fish = await this.db('fish').where(key).first();
    return fish;
  }

  async insertFish(columns: FishColumns) {
    const fish = await this.db('fish').returning(allColumns).insert(columns);
    return fish[0];
  }
}

export default FishDao;
