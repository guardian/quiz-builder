package auth

import com.gu.googleauth.{GoogleAuthConfig, Actions}
import conf.Config.{googleauth => config}
import org.joda.time.Duration
import play.api.mvc.Call
import controllers.routes

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

object GoogleAuthentication {
  val AntiForgeryKey = "antiForgeryToken"

  val googleAuthConfig = Await.result(for {
    clientId <- config.clientId
    secret <- config.clientSecret
    redirectHost <- config.redirectHost
  } yield GoogleAuthConfig(
    clientId.get,
    secret.get,
    redirectHost.get,
    Some("guardian.co.uk"),
    Some(Duration.standardHours(1)),
    enforceValidity = false
  ), 10.seconds)
}

trait AuthActions extends Actions {
  def loginTarget: Call = routes.Login.loginAction()

  val authConfig = GoogleAuthentication.googleAuthConfig
}
