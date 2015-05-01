package controllers

import _root_.data.{Quiz, QuizTable}
import auth.AuthActions
import org.joda.time.DateTime
import play.api.libs.json.Json
import play.api.mvc._
import scala.concurrent.ExecutionContext.Implicits.global
import utils.UUID

import scala.concurrent.Future

object Application extends Controller with AuthActions {
  def launchApp(ignoredParam: String) = AuthAction {
    Ok(views.html.index())
  }

  def listQuizzes = AuthAction.async {
    QuizTable.list() map { entries =>
      Ok(Json.toJson(ListQuizzesResponse(entries)))
    }
  }

  def getQuiz(id: String) = AuthAction.async {
    QuizTable.get(id) map { response =>
      (for {
        entry <- response
        quiz <- entry.quiz
      } yield GetQuizResponse(entry.createdBy, entry.createdAt, entry.updatedBy, entry.updatedAt, quiz)) match {
        case Some(reply) => Ok(Json.toJson(reply))

        case None => NotFound(s"Could not find quiz with id $id")
      }
    }
  }

  def createQuiz() = AuthAction.async(parse.json[CreateQuizRequest]) { request =>
    val id = UUID.next()
    val username = request.user.email

    QuizTable.create(username, Quiz.empty(
      id,
      request.body.title,
      request.body.`type`,
      request.body.defaultColumns
    )) map { response =>
      Ok(Json.toJson(CreateQuizResponse(id)))
    }
  }

  def deleteQuiz(id: String) = AuthAction.async { request =>
    QuizTable.delete(id) map { response =>
      Ok(Json.obj())
    }
  }

  def updateQuiz(id: String) = AuthAction.async(parse.json[UpdateQuizRequest]) { request =>
    val username = request.user.email
    val updatedAt = DateTime.now

    if (id != request.body.quiz.id) {
      Future.successful(BadRequest("Mismatched quiz IDs"))
    } else {
      QuizTable.update(username, updatedAt, request.body.quiz) map { _ =>
        Ok(Json.toJson(UpdateQuizResponse(updatedAt)))
      }
    }
  }
}
