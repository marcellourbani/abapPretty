import { Command } from "@oclif/command"
import { getClient, ALLCOMMONFLAGS, COMMONARGS } from "../lib/common"

import { Main } from "../main"

export default class Simulate extends Command {
  static description =
    "Simulate updates: perform all actions except writing the formatted source and activating"

  static examples = [
    "$ abapPretty simulate -c MYCONN DEVC/K ZMYPACKAGE",
    "$ abapPretty simulate -h host -P port -u user -p password DEVC/K ZMYPACKAGE",
    `$ SAP_ASHOST=host SAP_PORT=port SAP_USER=user SAP_PASSWORD=bash -c 'abapPretty simulate DEVC/K ZMYPACKAGE'`
  ]

  static flags = ALLCOMMONFLAGS

  static args = COMMONARGS

  async run() {
    const { args, flags } = this.parse(Simulate)

    const { objectType = "", objectName = "" } = args
    const client = await getClient(flags)
    const main = new Main(client, flags.abaplint)
    const objects = await main.list(objectType, objectName, flags)
    await main.processObjects(objects, {
      test: true,
      transport: flags.transport
    })
  }
}
