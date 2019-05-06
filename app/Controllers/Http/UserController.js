'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request, response }) {
    const data = request.only(['username', 'email', 'password'])
    const addresses = request.input('addresses')

    const trx = await Database.beginTransaction()

    try {
      const user = await User.create(data, trx)
      await user.addresses().createMany(addresses, trx)

      await trx.commit()
      return response.status(201).send(user)
    } catch (error) {
      trx.rollback()
      return response.status(500).send(error)
    }
  }
}

module.exports = UserController
