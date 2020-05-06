import { Command } from "@oclif/command"
import { cli } from "cli-ux"
import { supportedTypes } from "../lib/abap"

export default class List extends Command {
  static description = "List supported object types"

  static examples = ["$ abapPretty supportedtypes"]

  async run() {
    try {
      cli.table(supportedTypes, {
        type: {},
        desc: { header: "description" }
      })
    } catch (error) {
      this.log(error.toString())
    }
  }
}
