package conf

import data.ConfigTable
import play.api.Play.current
import play.api.Play.{configuration => config}

import scala.concurrent.Await
import scala.concurrent.duration._

object Config {
  object dynamodb {
    val tablePrefix = config.getString("dynamo_db.table_prefix")
  }

  object googleauth {
    lazy val clientId = Await.result(ConfigTable.get("googleauth.client_id"), 10.seconds)
    lazy val clientSecret = Await.result(ConfigTable.get("googleauth.client_secret"), 10.seconds)
    lazy val redirectHost = Await.result(ConfigTable.get("googleauth.redirect_host"), 10.seconds)
  }
}
