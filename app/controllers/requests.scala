package controllers

import data.{Quiz, QuizType}
import play.api.libs.json.Json

private [controllers] object CreateQuizRequest {
  implicit val jsonReads = Json.reads[CreateQuizRequest]
}

private [controllers] case class CreateQuizRequest(
  title: String,
  `type`: QuizType,
  defaultColumns: Option[Int]
)

private [controllers] object UpdateQuizRequest {
  implicit val jsonReads = Json.reads[UpdateQuizRequest]
}

private [controllers] case class UpdateQuizRequest(
  quiz: Quiz
)
