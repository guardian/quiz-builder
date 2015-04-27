package controllers

import auth.PanDomainAuthActions
import play.api._
import play.api.mvc._

object Application extends Controller with PanDomainAuthActions {
  def index = AuthAction {
    Ok(views.html.index("Your new application is ready."))
  }
}