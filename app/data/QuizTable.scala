package data

import awswrappers.dynamodb._
import com.amazonaws.services.dynamodbv2.model._
import conf.Config
import org.joda.time.DateTime
import play.api.libs.json.Json
import scala.collection.JavaConverters._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

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
    def iter(lastEvaluatedKey: Option[java.util.Map[String, AttributeValue]]): Future[Seq[QuizTable.Entry]] = {
      val scanRequest = new ScanRequest()
        .withTableName(TableName)
        .withLimit(10)
        .withAttributesToGet("id", "title", "createdAt", "createdBy", "updatedBy", "updatedAt")
        .withExclusiveStartKey(lastEvaluatedKey.orNull)

      dynamoDbClient.scanFuture(scanRequest) flatMap { result =>
        val theseItems = result.getItems.asScala.toSeq.flatMap { item =>
          Entry.fromAttributeValueMap(item.asScala.toMap)
        }

        Option(result.getLastEvaluatedKey) match {
          case Some(nextKey) =>
            iter(Some(nextKey)) map { otherItems =>
              theseItems ++ otherItems
            }

          case None =>
            Future.successful(theseItems)
        }
      }
    }

    iter(None).map(_.sortBy(x => - x.updatedAt.getOrElse(x.createdAt).getMillis))
  }

  def get(id: String) = {
    dynamoDbClient.getItemFuture(new GetItemRequest()
      .withTableName(TableName)
      .withKey(Map(
        "id" -> new AttributeValue().withS(id)
      ).asJava)
    ) map { result =>
      for {
        item <- Option(result.getItem)
        entry <- Entry.fromAttributeValueMap(item.asScala.toMap)
      } yield entry
    }
  }

  def delete(id: String) = {
    dynamoDbClient.deleteItemFuture(new DeleteItemRequest().withTableName(TableName).withKey(Map(
      "id" -> new AttributeValue().withS(id)
    ).asJava))
  }

  def create(createdBy: String, quiz: Quiz) = {
    dynamoDbClient.putItemFuture(new PutItemRequest().withTableName(TableName).withItem(Map(
      "id" -> new AttributeValue().withS(quiz.id),
      "title" -> new AttributeValue().withS(quiz.header.titleText),
      "createdAt" -> new AttributeValue().withN(DateTime.now.getMillis.toString),
      "createdBy" -> new AttributeValue().withS(createdBy),
      "quiz" -> new AttributeValue().withS(Json.stringify(Json.toJson(quiz)))
    ).asJava))
  }

  def update(updatedBy: String, updatedAt: DateTime, quiz: Quiz) = {
    def setTo(value: AttributeValue) =
      new AttributeValueUpdate().withAction(AttributeAction.PUT).withValue(value)

    dynamoDbClient.updateItemFuture(new UpdateItemRequest()
      .withTableName(TableName)
      .withKey(Map(
        "id" -> new AttributeValue().withS(quiz.id)
      ).asJava)
      .withAttributeUpdates(Map(
      "title" -> setTo(new AttributeValue().withS(quiz.header.titleText)),
      "updatedAt" -> setTo(new AttributeValue().withN(updatedAt.getMillis.toString)),
      "updatedBy" -> setTo(new AttributeValue().withS(updatedBy)),
      "quiz" -> setTo(new AttributeValue().withS(Json.stringify(Json.toJson(quiz))))
    ).asJava))
  }
}
