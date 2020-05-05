import * as Conf from "conf"
import { atob, btoa } from "./util"
export interface ConnDetails {
  id: string
  baseUrl: string
  userName: string
  password: string
}

const CONNECTIONS = "Connections"

const config = new Conf({ projectName: "abapPretty" })

function readConnections() {
  const connections: { [idx: string]: ConnDetails } =
    config.get(CONNECTIONS) || {}
  return connections
}

export function getConnection(id: string) {
  const connection = readConnections()[id]
  if (!connection) return
  if (connection?.password) connection.password = btoa(connection.password)

  return connection
}

export function getConnections() {
  const connections = readConnections()
  return Object.keys(connections).map(c => {
    const conn = connections[c]
    let { password } = conn
    password = password ? "set" : "not set"
    return { ...conn, password }
  })
}

export function saveConnection(conn: ConnDetails) {
  if (conn.password) conn = { ...conn, password: atob(conn.password) }

  const connections = readConnections()
  connections[conn.id] = conn

  config.set(CONNECTIONS, connections)
}
