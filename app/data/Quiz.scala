package data

import play.api.libs.json._

object QuizType {
  implicit val jsonFormat = new Format[QuizType] {
    override def writes(o: QuizType): JsValue = o match {
      case ListQuiz => JsString("list")
    }

    override def reads(json: JsValue): JsResult[QuizType] = json match {
      case JsString(s) => s match {
        case "list" => JsSuccess(ListQuiz)
        case x => JsError(s"$x is not a valid quiz type")
      }

      case _ => JsError("Expected a quiz type string")
    }
  }
}

sealed trait QuizType

case object ListQuiz extends QuizType

object QuizHeader {
  implicit val jsonFormat = Json.format[QuizHeader]
}

case class QuizHeader(titleText: String)

object Answer {
  implicit val jsonFormat = Json.format[Answer]
}

case class Answer(answer: String, imageUrl: Option[String], correct: Boolean)

object Question {
  implicit val jsonFormat = Json.format[Question]
}

case class Question(question: String, imageUrl: Option[String], more: Option[String], multiChoiceAnswers: Seq[Answer])

object ResultGroup {
  implicit val jsonFormat = Json.format[ResultGroup]
}

case class ResultGroup(title: String, share: String, minScore: Int)

object Quiz {
  implicit val jsonFormat = Json.format[Quiz]
}

case class Quiz(
  id: String,
  header: QuizHeader,
  `type`: QuizType,
  defaultColumns: Option[Int],
  questions: Seq[Question],
  resultGroups: Seq[ResultGroup]
)
