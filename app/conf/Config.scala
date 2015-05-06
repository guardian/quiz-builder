package conf

import play.api.Play.current
import play.api.Play.{configuration => config}

object Config {
  object googleauth {
    val antiForgeryKey = config.getString("googleauth.anti_forgery_key")
    val clientId = config.getString("googleauth.client_id")
    val clientSecret = config.getString("googleauth.client_secret")
    val redirectHost = config.getString("googleauth.redirect_host")
  }

  object dynamodb {
    val tablePrefix = config.getString("dynamo_db.table_prefix")
  }
}
