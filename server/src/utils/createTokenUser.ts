import { IUser } from "../types/typing";

const createTokenUser = (user: IUser) => {
    return {username: user.username, userId: user._id}
}

export default createTokenUser;