// be\routes\userRoutes.js - tambah endpoint refresh token
import express from 'express';
import { login } from '../controller/User/Login.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { logout } from '../controller/User/Logout.js';
import { findUserByToken } from '../controller/User/findUserByToken.js';
import { getUserList } from '../controller/User/getUserList.js';
import { refreshToken } from '../controller/User/refreshToken.js'; // Tambah controller ini

const userRoutes = express.Router();

userRoutes.post('/login', login);
userRoutes.post('/logout', logout);
userRoutes.post('/findUserByToken', verifyToken, findUserByToken);
userRoutes.post('/getUserList', verifyToken, getUserList);
userRoutes.post('/refresh-token', verifyToken, refreshToken); // Endpoint baru

export default userRoutes;