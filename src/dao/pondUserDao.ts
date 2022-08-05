import knex from 'knex';

class PondUserDao {

    // Knex db instance
    db: any;

    constructor(db: any) {
        this.db = db
    }

    async getPondUserById(id: number) {
        const pondUser = await this.db('pond_user').where({
            id
        }).first('id', 'google_id', 'username', 'email', 'exp');
        return pondUser;
    }

    async getPondUserByGoogleId(googleId: string) {
        const pondUser = await this.db('pond_user').where({
            google_id: googleId
        }).first('id', 'google_id', 'username', 'email', 'exp');
        return pondUser;
    }

    async insertPondUser(email: string, googleId: string) {
        const pondUser = await this.db('pond_user').insert({
            email,
            google_id: googleId,
            username: ''
        }).returning(['id', 'email', 'google_id', 'username']);
        return pondUser
    }

    async updatePondUser(columns: any) {
        const pondUser = await this.db('pond_user').where({
            id: columns.id
        }).update({
            username: columns.username,
            exp: columns.exp
        }).returning(['id', 'email', 'google_id', 'username']);
        return pondUser;
    }
}

export default PondUserDao;