package controllers

import _root_.data.QuizTable
import play.api._
import play.api.libs.json.Json
import play.api.mvc._
import scala.concurrent.ExecutionContext.Implicits.global

object Application extends Controller {
  def launchApp(ignoredParam: String) = Action {
    Ok(views.html.index())
  }

  def listQuizzes = Action.async {
    QuizTable.list() map { entries =>
      Ok(Json.toJson(ListQuizzesResponse(entries)))
    }
  }
}
