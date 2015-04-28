package conf

import com.amazonaws.auth.BasicAWSCredentials
import play.api.Play.current
import play.api.Play.{configuration => config}

object Config {
  object pandomain {
    val awsSecretAccessKey = config.getString("pandomain.aws.secret")

    val awsKeyId = config.getString("pandomain.aws.keyId")

    val awsCredentials = for {
      key <- awsKeyId
      secret <- awsSecretAccessKey
    } yield new BasicAWSCredentials(key, secret)

    val domain = config.getString("pandomain.domain").get

    val host = config.getString("host").get
  }

  object dynamodb {
    val awsKeyId = config.getString("dynamo_db.aws_key")
    val awsSecret = config.getString("dynamo_db.aws_secret")

    val awsCredentials = (for {
      key <- awsKeyId
      secret <- awsSecret
    } yield new BasicAWSCredentials(key, secret)).get

    val tablePrefix = config.getString("dynamo_db.table_prefix")
  }
}