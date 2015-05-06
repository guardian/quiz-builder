package auth

import com.gu.googleauth.{GoogleAuthConfig, Actions}
import conf.Config.{googleauth => config}
import org.joda.time.Duration
import play.api.mvc.Call
import controllers.routes

object GoogleAuthentication {
  val AntiForgeryKey = "antiForgeryToken"

  val googleAuthConfig = GoogleAuthConfig(
    config.clientId.get,
    config.clientSecret.get,
    config.redirectHost.get,
    Some("guardian.co.uk"),
    Some(Duration.standardHours(1)),
    enforceValidity = false
  )
}

trait AuthActions extends Actions {
  def loginTarget: Call = routes.Login.loginAction()

  val authConfig = GoogleAuthentication.googleAuthConfig
}
