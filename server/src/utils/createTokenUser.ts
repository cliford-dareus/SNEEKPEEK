import { IUser } from "../types/models.type";

const createTokenUser = (user: IUser) => {
    return {username: user.username, userId: user._id}
}

export default createTokenUser;