import { Command } from "@oclif/command"
import { cli } from "cli-ux"
import { getConnection } from "../lib/connections"
import { getClient, ALLCOMMONFLAGS, COMMONARGS } from "../lib/common"

import { list } from "../lib/abap"
import { processObjects } from "../main"

export default class Simulate extends Command {
  static description =
    "Simulate updates: perform all actions except writing the formatted source and activating"

  static examples = ["$ abapPretty simulate MYCONN DEVC/K ZMYPACKAGE"]

  static flags = ALLCOMMONFLAGS

  static args = COMMONARGS

  async run() {
    const { args, flags } = this.parse(Simulate)

    try {
      const { id = "", objectType = "", objectName = "" } = args
      const connection = getConnection(id)
      if (!connection) throw new Error(`Connection ${id} not defined`)
      const client = await getClient(connection, flags.password)
      if (!client) throw new Error(`Connection ${id} not valid`)
      const objects = await list(
        client,
        objectType,
        objectName,
        message => cli.action.start(message),
        flags.recursive
      )
      cli.action.stop("Done")
      await processObjects(client, objects, {
        test: true,
        transport: flags.transport
      })
    } catch (error) {
      this.log(error.toString())
    }
  }
}
