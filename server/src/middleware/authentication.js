import jwt from 'jsonwebtoken';
import config from '../config.js';

const Authentication = async (req, res, next) => {
  try {
    const is_token_valid = await validateToken(req)
    
    if(is_token_valid){
      // console.log("TOKEN VALIDO")
      next()
    }else{
      console.log("TOKEN INVALIDO")
      return res.status(401).send({message: "Acceso denegado"})
    }
  } catch (error) {
    
  }
}

async function validateToken(req){
  try {
    const signature = req.get('Authorization');
      if(signature){
        const tokenAccess = signature.split(' ')[1];
        const payload = await jwt.verify(tokenAccess,config.secretAccessKey);
        req.user = payload.id;
        req.tokenAccess = tokenAccess;
        return true;
      }else{
        throw new Error("Token no valido")
      }
  } catch (error) {
    return false
  }
}

export default Authentication
