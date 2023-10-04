import crypto from 'crypto'

import { createCookieSessionStorage } from '@remix-run/node'

const algorithm = 'aes-256-cbc' //Using AES encryption

const securityKey = Buffer.from(process.env.SESSION_COOKIE_SECRET!.slice(0, 32))

const initVector = Buffer.from(
  process.env.SESSION_COOKIE_SECRET_IV!.slice(0, 16),
)

function encrypt(message: string) {
  const cipher = crypto.createCipheriv(algorithm, securityKey, initVector)

  let encryptedData = cipher.update(message, 'utf-8', 'hex')

  encryptedData += cipher.final('hex')

  return encryptedData
}

function decrypt(encryptedData: string) {
  const decipher = crypto.createDecipheriv(algorithm, securityKey, initVector)

  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8')

  decryptedData += decipher.final('utf8')

  return decryptedData
}

type SessionFlashData = {
  error: string
}

interface SessionData {
  password: string
}

export const authSession = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: 'framboos_auth',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
    maxAge: 86_400, // one day
    secrets: [process.env.SESSION_COOKIE_SECRET!],
    decode: decrypt,
    encode: encrypt,
  },
})

export async function isLoggedIn(request: Request) {
  const session = await authSession.getSession(request.headers.get('Cookie'))

  const password = session.get('password')

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return false
  }

  return true
}
