package controllers

import play.api.mvc.{Action, Controller}

object Healthcheck extends Controller {
  def healthcheck = Action {
    // TODO make this depend on being able to contact DynamoDB
    Ok("healthy!")
  }
}
