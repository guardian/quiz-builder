package conf

import data.ConfigTable
import play.api.Play.current
import play.api.Play.{configuration => config}
import com.amazonaws.auth.BasicAWSCredentials

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

  object awsKeys {
    case class AWSCredentials(accessKey:String)(val secretKey:String) {
      lazy val awsApiCreds = new BasicAWSCredentials(accessKey, secretKey)
    }
    object AWSCredentials {
      def apply(accessKey: Option[String], secretKey: Option[String]): Option[AWSCredentials] = for {
        ak <- accessKey
        sk <- secretKey
      } yield AWSCredentials(ak)(sk)
    }

    val accessKey: Option[String] = config.getString("AWS_ACCESS_KEY")
    val secretKey: Option[String] = config.getString("AWS_SECRET_KEY")
    val creds = AWSCredentials(accessKey, secretKey)
  }
}
