package controllers

import data.QuizTable
import play.api.libs.json.Json

private [controllers] object ListQuizzesResponse {
  implicit val jsonWrites = Json.writes[ListQuizzesResponse]
}

private [controllers] case class ListQuizzesResponse(quizzes: Seq[QuizTable.Entry])