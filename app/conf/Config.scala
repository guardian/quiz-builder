package conf

import _root_.aws.AwsInstanceTags
import data.ConfigTable
import play.api.Play.current
import play.api.Play.{configuration => config}


object Config extends AwsInstanceTags {
  object dynamodb {
    val tablePrefix = config.getString("dynamo_db.table_prefix")
  }

  object googleauth {
    lazy val clientId = ConfigTable.get("googleauth.client_id")
    lazy val clientSecret = ConfigTable.get("googleauth.client_secret")
    lazy val redirectHost = ConfigTable.get("googleauth.redirect_host")
  }

  object pandomain {
    lazy val stage: String = readTag("Stage") match {
      case Some(value) => value
      case None => "DEV" // default to dev stage
    }

    lazy val domain: String = stage match {
      case "PROD" => "gutools.co.uk"
      case "DEV" => "local.dev-gutools.co.uk"
      case x => x.toLowerCase() + ".dev-gutools.co.uk"
    }

    lazy val hostName: String = "https://quizzes-old." + domain
    lazy val pandomainKey: Option[String] = config.getString("pandomain.aws.key")
    lazy val pandomainSecret: Option[String] = config.getString("pandomain.aws.secret")
  }

  object deployment {
    lazy val rootDomain = ConfigTable.get("deployment.root_domain")
    lazy val bucket = ConfigTable.get("deployment.bucket")
    lazy val accessKeyId = ConfigTable.get("deployment.access_key_id")
    lazy val secretAccessKey = ConfigTable.get("deployment.secret_access_key")
  }
}
