import dbLocal from 'db-local';
import { randomUUID } from 'node:crypto';
const { Schema } = new dbLocal({ path: "./db" });

const User = Schema("User", {
    _id: { type: String, require: true },
    name: { type: String, require: true },
    username: { type: String, require: true },
    hashRefresh: { type: String, require: false, default: '' },
    hashPassword: { type: String, require: true }
})

export class UsersData {
    static async createUser(name, username, hashPassword) {
        try {
            const findUser = await User.findOne({ username });

            if (findUser) return 'duplicate';

            const UUID = randomUUID();
            await User.create({
                _id: UUID,
                name,
                username,
                hashPassword
            }).save();

            return UUID;
        } catch (error) {
            return;
        }
    }

    static async findUser(username) {
        try {
            const user = await User.findOne({ username });
            return user;
        } catch (error) {
            return;
        }
    }


    static async updateTokenUser(_id, hashRefresh) {
        try {
            const user = await User.update({ _id }, { hashRefresh });
            user.hashRefresh = hashRefresh;
            await user.save();
            return;
        } catch (error) {
            return;
        }
    }
}