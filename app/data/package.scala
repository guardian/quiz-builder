import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBAsyncClient
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import grizzled.slf4j.Logging
import org.joda.time.DateTime
import play.api.libs.json.{Format, Json}

import scala.util.Try

package object data extends Logging {

  val dynamoDbClient: AmazonDynamoDBAsyncClient =
    new AmazonDynamoDBAsyncClient().withRegion(Regions.EU_WEST_1)

  implicit class RichAttributeMap(map: Map[String, AttributeValue]) {
    def getString(k: String): Option[String] =
      map.get(k).flatMap(v => Option(v.getS))

    def getLong(k: String): Option[Long] = {
      map.get(k).flatMap({ v =>
        val x = Try(v.getN.toLong)

        x.failed foreach {
          error => logger.error(s"Error de-serializing $k as Long", error)
        }

        x.toOption
      })
    }

    def getDateTime(k: String): Option[DateTime] =
      getLong(k).map(n => new DateTime(n))

    def getJson(k: String) = getString(k).flatMap(s => Try(Json.parse(s)).toOption)

    def getSerializedJson[A](k: String)(implicit formatter: Format[A]) =
      getJson(k).flatMap(x => formatter.reads(x).asOpt)
  }
}
