import { Command } from "@oclif/command"
import { getClient, COMMONFLAGS, COMMONARGS } from "../lib/common"
import { cli } from "cli-ux"
import { list } from "../lib/abap"

export default class List extends Command {
  static description = "List objects that would be updated"

  static examples = [
    "$ abapPretty list -c MYCONN DEVC/K ZMYPACKAGE",
    "$ abapPretty list -h host -P port -u user -p password DEVC/K ZMYPACKAGE",
    `$ SAP_ASHOST=host SAP_PORT=port SAP_USER=user SAP_PASSWORD=bash -c 'abapPretty list DEVC/K ZMYPACKAGE'`
  ]

  static flags = COMMONFLAGS

  static args = COMMONARGS

  static strict = false

  async run() {
    const { args, flags } = this.parse(List)

    try {
      const { objectType = "", objectName = "" } = args
      const client = await getClient(flags)
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
      this.log(error.toString())
    }
  }
}
