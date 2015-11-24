package controllers

import conf.Config.{pandomain => config}
import controllers._
import play.api.mvc._
import com.gu.pandomainauth.model.AuthenticatedUser
import com.gu.pandomainauth.action.AuthActions
import com.amazonaws.auth.BasicAWSCredentials

trait PanDomainAuthActions extends AuthActions {
  override def validateUser(authedUser: AuthenticatedUser): Boolean = {
    authedUser.multiFactor
  }

  override lazy val system: String = "quiz-builder"
  override def authCallbackUrl: String = config.hostName + "/oauthCallback"
  override lazy val domain: String = config.domain
  lazy val awsCredentials = for (key <- config.pandomainKey; secret <- config.pandomainSecret) yield new BasicAWSCredentials(key, secret)


}
