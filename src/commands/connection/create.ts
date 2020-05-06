import { Command } from "@oclif/command"
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

  async run() {
    const { args } = this.parse(Login)

    try {
      const { id = "", baseUrl = "", userName = "", password = "" } = args
      saveConnection({ id, baseUrl, userName, password })
      this.log(`Connection ${id} created/updated`)
    } catch (error) {
      this.log(error.toString())
    }
  }
}
