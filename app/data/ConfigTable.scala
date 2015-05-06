package data

import com.amazonaws.services.dynamodbv2.model.{AttributeValue, GetItemRequest}
import conf.Config
import collection.JavaConverters._

object ConfigTable {
  val TableName = Config.dynamodb.tablePrefix.getOrElse("") + "Config"

  def get(key: String): Option[String] = {
    Option(dynamoDbClient.getItem(new GetItemRequest()
      .withTableName(TableName)
      .withKey(Map(
        "key" -> new AttributeValue().withS(key)
      ).asJava)
      .withAttributesToGet("value")
    ).getItem).flatMap(_.asScala.get("value").map(_.getS))
  }
}
