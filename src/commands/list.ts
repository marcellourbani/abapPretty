import { Command } from "@oclif/command"
import { getConnection } from "../lib/connections"
import { getClient, COMMONFLAGS, COMMONARGS } from "../lib/common"
import { cli } from "cli-ux"
import { list } from "../lib/abap"

export default class List extends Command {
  static description = "List objects that would be updated"

  static examples = ["$ abapPretty list MYCONN DEVC/K ZMYPACKAGE"]

  static flags = COMMONFLAGS

  static args = COMMONARGS

  async run() {
    const { args, flags } = this.parse(List)

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
      cli.table(objects, {
        type: {},
        name: {},
        url: {}
      })
    } catch (error) {
      this.log(error)
    }
  }
}
