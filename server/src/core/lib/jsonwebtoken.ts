import type { JwtPayload, SignOptions } from 'jsonwebtoken'
import jsonwebtoken from 'jsonwebtoken'

export const signJWT = <T extends object>(
  payload: T,
  secret: string,
  options: SignOptions,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(payload, secret, options, (error, token) => {
      if (error) return reject(error)
      return resolve(token as string)
    })
  })
}
export const verifyJwt = <T>(token: string, secret: string): Promise<T & JwtPayload> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, secret, (error, decoded) => {
      if (error) return reject(error)
      return resolve(decoded as T & JwtPayload)
    })
  })
}
