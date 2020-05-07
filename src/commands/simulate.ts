import { Command } from "@oclif/command"
import { cli } from "cli-ux"
import { getClient, ALLCOMMONFLAGS, COMMONARGS } from "../lib/common"

import { list } from "../lib/abap"
import { Main } from "../main"

export default class Simulate extends Command {
  static description =
    "Simulate updates: perform all actions except writing the formatted source and activating"

  static examples = ["$ abapPretty simulate MYCONN DEVC/K ZMYPACKAGE"]

  static flags = ALLCOMMONFLAGS

  static args = COMMONARGS

  async run() {
    const { args, flags } = this.parse(Simulate)

    try {
      const { objectType = "", objectName = "" } = args
      const client = await getClient(flags)
      const main = new Main(client)
      const objects = await list(
        client,
        objectType,
        objectName,
        message => cli.action.start(message),
        flags.recursive
      )
      cli.action.stop("Done")
      await main.processObjects(objects, {
        test: true,
        transport: flags.transport
      })
    } catch (error) {
      this.log(error.toString())
    }
  }
}
