import { io } from "socket.io-client";
import { IAuthInitialState } from '../../utils/types/types'

const URL = "https://sneekpeek.onrender.com/";
const socket = io(URL, { autoConnect: false });

const socketConnect = (user: IAuthInitialState ) => {
    // socket.disconnect()
    socket.auth = {id: user.user?.userId, name: user.user?.username}
    socket.connect()
}

export { socket, socketConnect }
