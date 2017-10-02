module.exports = {

  database: process.env.DATABASE || 'mongodb://localhost:27017/dnbtest',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'dnb123',

}