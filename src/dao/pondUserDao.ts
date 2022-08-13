interface UpdatePondUserRequestType {
  id: number,
  username: string
}

class PondUserDao {
  // Knex db instance
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getPondUserById(id: number) {
    const pondUser = await this.db('pond_user')
      .where({
        id,
      })
      .first('id', 'google_id', 'username', 'email');
    return pondUser;
  }

  async getPondUserByGoogleId(googleId: string) {
    const pondUser = await this.db('pond_user')
      .where({
        google_id: googleId,
      })
      .first('id', 'google_id', 'username', 'email');
    return pondUser;
  }

  async insertPondUser(email: string, googleId: string, username: string) {
    const pondUser = await this.db('pond_user')
      .returning(['id', 'email', 'google_id', 'username'])
      .insert({
        email,
        google_id: googleId,
        username,
      });
    return pondUser[0];
  }

  async updatePondUser(columns: UpdatePondUserRequestType) {
    const pondUser = await this.db('pond_user')
      .returning(['id', 'email', 'google_id', 'username'])
      .where({
        id: columns.id,
      })
      .update({
        username: columns.username,
      });
    return pondUser[0];
  }
}

export default PondUserDao;
