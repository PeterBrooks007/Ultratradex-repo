import io from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

let socket;

const connectSocket = (user_id) => {
  socket = io(BACKEND_URL, {
    query: `user_id=${user_id}`,
  });
};

//

export { socket, connectSocket };
