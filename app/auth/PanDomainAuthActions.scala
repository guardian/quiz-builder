package auth

import conf.Config.pandomain._
import com.gu.pandomainauth.action.AuthActions
import com.gu.pandomainauth.model.AuthenticatedUser

trait PanDomainAuthActions extends AuthActions {
  override def validateUser(authedUser: AuthenticatedUser): Boolean = {
    authedUser.user.emailDomain == "guardian.co.uk" && authedUser.multiFactor
  }

  override def cacheValidation = true

  override def authCallbackUrl: String = host + "/oauthCallback"

  override lazy val domain: String = conf.Config.pandomain.domain

  override lazy val system: String = "quiz-builder"
}
