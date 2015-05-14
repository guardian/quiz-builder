package controllers

import play.api.libs.json.Json

object DeployResponse {
  implicit val jsonWrites = Json.writes[DeployResponse]
}

case class DeployResponse(boot: String)
