import { Command, flags } from "@oclif/command"
import { saveConnection } from "../../lib/connections"

export default class Login extends Command {
  static description = "Store the server and user details"

  static examples = [
    "$ abapPretty login MYCONN http://myserver:8000 myuser mypass"
  ]

  static args = [
    {
      name: "id",
      required: true,
      description: "connection ID"
    },
    {
      name: "baseUrl",
      required: true,
      description: "Server base URL"
    },
    {
      name: "userName",
      required: true,
      description: "Username"
    },
    {
      name: "password",
      description: "User password. If not set will be asked on use",
      required: false
    }
  ]

  static flags = {
    client: flags.string({
      char: "C",
      description: "SAP client to connect to"
    }),
    "skip-ssl-validation": flags.boolean({
      char: "s",
      default: false,
      description: "Don't validate SSL certificate - DANGEROUS"
    }),
    certPath: flags.string({
      description: "Path to SSL certificate"
    })
  }

  async run() {
    const { args, flags } = this.parse(Login)

    try {
      const { id = "", baseUrl = "", userName = "", password = "" } = args
      const { client, "skip-ssl-validation": nosslvalidation, certPath } = flags
      saveConnection({
        id,
        baseUrl,
        userName,
        password,
        certPath,
        client,
        nosslvalidation
      })
      this.log(`Connection ${id} created/updated`)
    } catch (error) {
      this.log(error.toString())
    }
  }
}
