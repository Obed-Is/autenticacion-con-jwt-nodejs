import sql from 'mssql';
import { sqlConfig } from '../config.js';

/**
 * Clase que contiene los metodos para hacer las consultas a la base de datos
 */
export class UsersDb {
    /** @private Variable que contiene la configuracion de la base de datos para hacer las consultas */
    #_sqlConfig;

    constructor() {
        this.#_sqlConfig = sqlConfig;
    }

    async findUser(username) {
        try {
            const conn = await sql.connect(this.#_sqlConfig);
            const result = await conn.request()
                .input("username", sql.VarChar, username)
                .query(`
                    SELECT u.id, u.password_hash, u.full_name, u.username, ct.refresh_token_hash 
                    FROM users u 
                    LEFT JOIN controlToken ct ON u.id = ct.id_user
                    WHERE LOWER(u.username) = LOWER(@username)`);

            return result.recordset[0];
        } catch (error) {
            return error;
        }
    }

    async createUser(name, username, hashPassword) {
        try {
            const conn = await sql.connect(this.#_sqlConfig);
            const result = await conn.request()
                .input("full_name", sql.VarChar, name)
                .input("username", sql.VarChar, username)
                .input("password_hash", sql.VarChar, hashPassword)
                .query(`
                    INSERT INTO users (full_name, username, password_hash) 
                    OUTPUT INSERTED.id
                    VALUES (@full_name, @username, @password_hash)`
                );

            return result.recordset[0].id;
        } catch (error) {
            return error;
        }
    }

    /**
     * Verifica si existe un token de usuario en la tabla
     * @param {number} idUser 
     * @returns {Promise<Object>}
     */
    async existTokenUser(idUser) {
        try {
            const conn = await sql.connect(this.#_sqlConfig);
            const result = await conn.request()
                .input("id_user", sql.Int, idUser)
                .query(`SELECT id FROM controlToken WHERE id_user = @id_user`);

            return result.recordset[0];
        } catch (error) {
            return error;
        }
    }

    /**
    * Crea un token para un usuario en la tabla si no tiene
    * @param {number} idUser 
    * @param {string} hashRefresh 
    * @returns {Promise<Object>}
    */
    async createTokenUser(idUser, hashRefresh) {
        try {
            const conn = await sql.connect(this.#_sqlConfig);
            const result = await conn.request()
                .input("id_user", sql.Int, idUser)
                .input("refresh_token_hash", sql.VarChar, hashRefresh)
                .query(`
                    INSERT INTO controlToken (id_user, refresh_token_hash)
                    VALUES (@id_user, @refresh_token_hash)`
                );

            return result.rowsAffected[0];
        } catch (error) {
            return error;
        }
    }

    /**
     * Actualiza el token de un usuario en la tabla si ya existe alguno
     * @param {number} idUser 
     * @param {string} hashRefresh 
     * @returns {Promise<Object>}
     */
    async updateTokenUser(idUser, hashRefresh) {
        try {
            const conn = await sql.connect(this.#_sqlConfig);
            const result = await conn.request()
                .input("id_user", sql.Int, idUser)
                .input("refresh_token_hash", sql.VarChar, hashRefresh)
                .query(`
                    UPDATE controlToken
                    SET refresh_token_hash = @refresh_token_hash
                    WHERE id_user = @id_user`
                );

            return result.rowsAffected[0];
        } catch (error) {
            return error;
        }
    }


}