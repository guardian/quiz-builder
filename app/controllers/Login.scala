package controllers

import auth.AuthActions
import com.gu.googleauth.{UserIdentity, GoogleAuth}
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import play.api.Play.current

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

object Login extends Controller with AuthActions {
  import auth.GoogleAuthentication.{AntiForgeryKey, googleAuthConfig}

  def login = Action { request =>
    val error = request.flash.get("error")
    Ok(views.html.login(error))
  }

  /*
  Redirect to Google with anti forgery token (that we keep in session storage - note that flashing is NOT secure)
   */
  def loginAction = Action.async { implicit request =>
    val antiForgeryToken = GoogleAuth.generateAntiForgeryToken()
    GoogleAuth.redirectToGoogle(googleAuthConfig, antiForgeryToken).map {
      _.withSession { request.session + (AntiForgeryKey -> antiForgeryToken) }
    }
  }

  def oauth2Callback = Action.async { implicit request =>
    val session = request.session
    session.get(AntiForgeryKey) match {
      case None =>
        Future.successful(Redirect(routes.Login.login()).flashing("error" -> "Anti forgery token missing in session"))
      case Some(token) =>
        GoogleAuth.validatedUserIdentity(googleAuthConfig, token).map { identity =>
          // We store the URL a user was trying to get to in the LOGIN_ORIGIN_KEY in AuthAction
          // Redirect a user back there now if it exists
          val redirect = session.get(LOGIN_ORIGIN_KEY) match {
            case Some(url) => Redirect(url)
            case None => Redirect(routes.Application.launchApp(""))
          }
          // Store the JSON representation of the identity in the session - this is checked by AuthAction later
          redirect.withSession {
            session + (UserIdentity.KEY -> Json.toJson(identity).toString) - AntiForgeryKey - LOGIN_ORIGIN_KEY
          }
        } recover {
          case t =>
            // you might want to record login failures here - we just redirect to the login page
            Redirect(routes.Login.login())
              .withSession(session - AntiForgeryKey)
              .flashing("error" -> s"Login failure: ${t.toString}")
        }
    }
  }

  def logout = Action { implicit request =>
    Redirect(routes.Application.launchApp("")).withNewSession
  }
}
