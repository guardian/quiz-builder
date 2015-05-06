package data

import awswrappers.dynamodb._
import com.amazonaws.services.dynamodbv2.model.{AttributeValue, GetItemRequest}
import conf.Config
import collection.JavaConverters._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

object ConfigTable {
  val TableName = Config.dynamodb.tablePrefix.getOrElse("") + "Config"

  def get(key: String): Future[Option[String]] = {
    dynamoDbClient.getItemFuture(new GetItemRequest()
      .withTableName(TableName)
      .withKey(Map(
        "key" -> new AttributeValue().withS(key)
      ).asJava)
      .withAttributesToGet("value")
    ) map { result =>
      Option(result.getItem).flatMap(_.asScala.get("value").map(_.getS))
    }
  }
}
