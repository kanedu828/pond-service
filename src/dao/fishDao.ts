interface FishColumns {
  id?: number;
  fish_id?: number;
  length?: number;
  pond_user_id?: number;
  count?: number;
}

const allColumns = ['length', 'fish_id', 'pond_user_id', 'created_at', 'updated_at'];

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

  async updateFish(key: FishColumns, columns: FishColumns) {
    const fish = await this.db('fish')
      .returning(allColumns)
      .where(key)
      .update(columns);
    return fish[0];
  }
}

export default FishDao;
