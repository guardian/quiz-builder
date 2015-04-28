package controllers

import data.QuizType
import play.api.libs.json.Json

object CreateQuizRequest {
  implicit val jsonReads = Json.reads[CreateQuizRequest]
}

case class CreateQuizRequest(
  title: String,
  `type`: QuizType,
  defaultColumns: Option[Int]
)