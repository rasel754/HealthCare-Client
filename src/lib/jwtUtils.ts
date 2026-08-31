import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from 'jsonwebtoken';



const verifyToken = (token: string, secret: string) => {
    try {
        const decode = jwt.verify(token, secret) as JwtPayload;
        return{
            success:true,
            data:decode
        }
    } catch (error) {
        return{
            success:false,
            message:error
        }
    }
};

const decodedToken = (token: string) => {
    const decoded = jwt.decode(token) as JwtPayload;
    return decoded;
};  

const jwtUtils= {
    verifyToken,
    decodedToken
};

export default jwtUtils;

