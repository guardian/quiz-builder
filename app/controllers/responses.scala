package controllers

import data.{Quiz, QuizTable}
import org.joda.time.DateTime
import play.api.libs.json.Json

private [controllers] object ListQuizzesResponse {
  implicit val jsonWrites = Json.writes[ListQuizzesResponse]
}

private [controllers] case class ListQuizzesResponse(quizzes: Seq[QuizTable.Entry])

private [controllers] object GetQuizResponse {
  implicit val jsonWrites = Json.writes[GetQuizResponse]
}

private [controllers] case class GetQuizResponse(
  createdBy: String,
  createdAt: DateTime,
  updatedBy: Option[String],
  updatedAt: Option[DateTime],
  quiz: Quiz
)

private [controllers] object CreateQuizResponse {
  implicit val jsonWrites = Json.writes[CreateQuizResponse]
}

private [controllers] case class CreateQuizResponse(
  id: String
)

private [controllers] object UpdateQuizResponse {
  implicit val jsonWrites = Json.writes[UpdateQuizResponse]
}

private [controllers] case class UpdateQuizResponse(
  updatedAt: DateTime
)