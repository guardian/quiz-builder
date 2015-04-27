package controllers

import auth.PanDomainAuthActions
import play.api.mvc.{Action, Controller}

object Login extends Controller with PanDomainAuthActions {
  def oauthCallback = Action.async { implicit request =>
    processGoogleCallback()
  }

  def logout = Action { implicit request =>
    processLogout(request)
  }
}
