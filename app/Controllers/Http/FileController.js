'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  /**
   * Return image file
   * GET files/:id
   */
  async show ({ params, response }) {
    try {
      const file = await File.findOrFail(params.id)

      // return response.download(Helpers.tmpPath(`uploads/${file.file}`))
      return response.download(await Helpers.tmpPath(`uploads/${file.file}`))

      // let pathFile = null
      // try {
      //   pathFile = Helpers.tmpPath(`uploads/${file.file}`)
      // } catch (error) {
      //   return response
      //     .status(error.status)
      //     .send({ error: { message: 'Erro ao buscar o arquivo' } })
      // }
      // return response.download(pathFile)
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro ao buscar o arquivo' } })
    }
  }

  /**
   * Create/save a new file.
   * POST files
   */
  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '5mb' })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.move()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro no upload de arquivo' } })
    }
  }
}

module.exports = FileController
