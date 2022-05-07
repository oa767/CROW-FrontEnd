import React from 'react';
import {io} from 'socket.io-client';

export const socket = io("https://crow-frontend.herokuapp.com/");
export const SocketContext = React.createContext();
