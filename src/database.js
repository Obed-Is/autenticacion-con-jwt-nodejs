import dbLocal from 'db-local';
import { randomUUID } from 'node:crypto';
const { Schema } = new dbLocal({ path: "./db" });

const User = Schema("User", {
    _id: { type: String, require: true },
    name: { type: String, require: true },
    lastName: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true }
})

export class UsersData {
    static async createUser(name, lastName, username, password) {
        try {
            const findUser = await User.findOne({ username });
            console.log("nombre de usuario duplicado:\n", findUser);

            if (findUser) {
                return 'duplicate';
            }

            const UUID = randomUUID();
            const user = await User.create({
                _id: UUID,
                name,
                lastName,
                username,
                password
            }).save();

            return UUID;
        } catch (error) {
            console.log(error)
        }
    }
}