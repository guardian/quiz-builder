package controllers

import play.api.mvc.{Action, Controller}

object Cors extends Controller {
  def headers = List(
    "Access-Control-Allow-Origin" -> "*",
    "Access-Control-Allow-Methods" -> "GET, POST, OPTIONS, DELETE, PUT",
    "Access-Control-Max-Age" -> "3600",
    "Access-Control-Allow-Headers" -> "Origin, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Credentials" -> "true"
  )

  def options(url: String) = Action { request =>
    NoContent.withHeaders(headers : _*)
  }
}
