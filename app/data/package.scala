import com.amazonaws.regions.Regions
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBAsyncClient
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import conf.Config.dynamodb.awsCredentials
import org.joda.time.DateTime
import play.api.libs.json.{Format, Json}

import scala.util.Try

package object data {
  val dynamoDbClient: AmazonDynamoDBAsyncClient =
    new AmazonDynamoDBAsyncClient(awsCredentials).withRegion(Regions.EU_WEST_1)

  implicit class RichAttributeMap(map: Map[String, AttributeValue]) {
    def getString(k: String): Option[String] =
      map.get(k).flatMap(v => Option(v.getS))

    def getDateTime(k: String): Option[DateTime] =
      map.get(k).flatMap({ v =>
        val x = Try(v.getN.toLong)

        x.failed foreach {
          error => println(error)
        }

        x.toOption
      }).map(n => new DateTime(n))

    def getJson(k: String) = getString(k).flatMap(s => Try(Json.parse(s)).toOption)

    def getSerializedJson[A](k: String)(implicit formatter: Format[A]) =
      getJson(k).flatMap(x => formatter.reads(x).asOpt)
  }
}
