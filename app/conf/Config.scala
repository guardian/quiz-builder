package conf

import data.ConfigTable
import play.api.Play.current
import play.api.Play.{configuration => config}

object Config {
  object dynamodb {
    val tablePrefix = config.getString("dynamo_db.table_prefix")
  }

  object googleauth {
    lazy val clientId = ConfigTable.get("googleauth.client_id")
    lazy val clientSecret = ConfigTable.get("googleauth.client_secret")
    lazy val redirectHost = ConfigTable.get("googleauth.redirect_host")
  }
}
