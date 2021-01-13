const { createAPISig, Client } = require('@textile/hub')

const getAPISig = async (seconds = 300) => {
  const expiration = new Date(Date.now() + 1000 * seconds)
  return await createAPISig(process.env.USER_API_SECRET, expiration)
}

const newClientDB = async () => {
  const API = process.env.API || undefined
  const db = await Client.withKeyInfo({
    key: process.env.USER_API_KEY,
    secret: process.env.USER_API_SECRET
  }, API)
  return db;
}

module.exports = {
  getAPISig,
  newClientDB
}
