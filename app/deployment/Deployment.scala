package deployment

import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.model.{CannedAccessControlList, AccessControlList, ObjectMetadata}
import com.amazonaws.util.StringInputStream
import data.Quiz
import conf.Config.{deployment => config}
import lib.ResourcesHelper
import play.api.libs.json.Json

object Deployment extends ResourcesHelper {
  val QuizFileName = "quiz-app.js"

  val awsClient = (for {
    keyId <- config.accessKeyId
    secretKey <- config.secretAccessKey
  } yield new AmazonS3Client(new BasicAWSCredentials(keyId, secretKey))).getOrElse(new AmazonS3Client())

  def deploy(quiz: Quiz) = {
    val root = config.rootDomain.get

    val bootScript = views.txt.boot(s"$root/quiz-builder/${quiz.id}/app.js", Json.toJson(quiz)).body
    val bootKey = s"quiz-builder/${quiz.id}/boot.js"
    val appKey = s"quiz-builder/${quiz.id}/app.js"

    putPublic(bootKey, bootScript)

    val appScript = slurp(QuizFileName).get

    putPublic(appKey, appScript)

    s"$root/quiz-builder/${quiz.id}/boot.js"
  }

  def putPublic(key: String, text: String) = {
    val bucket = config.bucket.get

    val metaData = new ObjectMetadata()
    metaData.setCacheControl("max-age=300")
    metaData.setContentType("application/javascript")
    metaData.setContentEncoding("utf-8")

    awsClient.putObject(
      bucket,
      key,
      new StringInputStream(text),
      metaData
    )

    awsClient.setObjectAcl(bucket, key, CannedAccessControlList.PublicRead)
  }
}
