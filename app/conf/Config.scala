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

  object deployment {
    lazy val rootDomain = ConfigTable.get("deployment.root_domain")
    lazy val bucket = ConfigTable.get("deployment.bucket")
    lazy val accessKeyId = ConfigTable.get("deployment.access_key_id")
    lazy val secretAccessKey = ConfigTable.get("deployment.secret_access_key")
  }
}
