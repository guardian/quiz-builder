package data

import awswrappers.dynamodb._
import com.amazonaws.services.dynamodbv2.model.{PutItemRequest, GetItemRequest, AttributeValue, ScanRequest}
import conf.Config
import org.joda.time.DateTime
import play.api.libs.json.Json
import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext.Implicits.global

object QuizTable {
  object Entry {
    implicit val jsonWrites = Json.writes[Entry]

    def fromAttributeValueMap(xs: Map[String, AttributeValue]) = {
      for {
        id <- xs.getString("id")
        title <- xs.getString("title")
        createdBy <- xs.getString("createdBy")
        createdAt <- xs.getDateTime("createdAt")
      } yield Entry(
        id,
        title,
        createdBy,
        createdAt,
        xs.getString("updatedBy"),
        xs.getDateTime("updatedAt"),
        xs.getSerializedJson[Quiz]("quiz")
      )
    }
  }

  case class Entry(
    id: String,
    title: String,
    createdBy: String,
    createdAt: DateTime,
    updatedBy: Option[String],
    updatedAt: Option[DateTime],
    quiz: Option[Quiz]
  )

  val TableName = Config.dynamodb.tablePrefix.getOrElse("") + "Quizzes"

  def list() = {
    dynamoDbClient.scanFuture(new ScanRequest()
      .withTableName(TableName)
      .withLimit(10)
      .withAttributesToGet("id", "title", "createdAt", "createdBy", "updatedBy", "updatedAt")
    ) map { result =>
      (result.getItems.asScala.toSeq map { item =>
        Entry.fromAttributeValueMap(item.asScala.toMap)
      }).flatten
    }
  }

  def get(id: String) = {
    dynamoDbClient.getItemFuture(new GetItemRequest().withTableName(TableName)) map { result =>
      Entry.fromAttributeValueMap(result.getItem.asScala.toMap)
    }
  }

  def create(id: String, createdBy: String, quiz: Quiz) = {
    dynamoDbClient.putItemFuture(new PutItemRequest().withTableName(TableName).withItem(Map(
      "id" -> new AttributeValue().withS(id),
      "title" -> new AttributeValue().withS(quiz.header.titleText),
      "createdAt" -> new AttributeValue().withN(DateTime.now.getMillis.toString),
      "createdBy" -> new AttributeValue().withS(createdBy),
      "quiz" -> new AttributeValue().withS(Json.stringify(Json.toJson(quiz)))
    ).asJava))
  }

  def update(id: String, updatedBy: String, quiz: Quiz) = {
    dynamoDbClient.putItemFuture(new PutItemRequest().withTableName(TableName).withItem(Map(
      "id" -> new AttributeValue().withS(id),
      "title" -> new AttributeValue().withS(quiz.header.titleText),
      "updatedAt" -> new AttributeValue().withN(DateTime.now.getMillis.toString),
      "updatedBy" -> new AttributeValue().withS(updatedBy),
      "quiz" -> new AttributeValue().withS(Json.stringify(Json.toJson(quiz)))
    ).asJava))
  }
}
