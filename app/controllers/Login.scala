package controllers

import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import play.api.Play.current

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

object Login extends Controller with PanDomainAuthActions {
  def oauthCallback = Action.async { implicit request =>
    processGoogleCallback()

  }

  def logout = Action.async { implicit request =>
    Future(processLogout)
  }
}
