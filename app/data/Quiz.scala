package data

import play.api.libs.json._

object QuizType {
  implicit val jsonFormat = new Format[QuizType] {
    override def writes(o: QuizType): JsValue = o match {
      case KnowledgeQuiz => JsString("knowledge")
      case PersonalityQuiz => JsString("personality")
    }

    override def reads(json: JsValue): JsResult[QuizType] = json match {
      case JsString(s) => s match {
        case "knowledge" => JsSuccess(KnowledgeQuiz)
        case "personality" => JsSuccess(PersonalityQuiz)
        case x => JsError(s"$x is not a valid quiz type")
      }

      case _ => JsError("Expected a quiz type string")
    }
  }
}

sealed trait QuizType

case object KnowledgeQuiz extends QuizType
case object PersonalityQuiz extends QuizType

object QuizHeader {
  implicit val jsonFormat = Json.format[QuizHeader]
}

case class QuizHeader(titleText: String)

object Answer {
  implicit val jsonFormat = Json.format[Answer]
}

case class Answer(answer: String, imageUrl: Option[String], correct: Option[Boolean], buckets: Option[Seq[String]])

object Question {
  implicit val jsonFormat = Json.format[Question]
}

case class Question(question: String, imageUrl: Option[String], more: Option[String], multiChoiceAnswers: Seq[Answer])

object ResultBucket {
  implicit val jsonFormat = Json.format[ResultBucket]
}

case class ResultBucket(
  id: String,
  title: String,
  description: String,
  href: Option[String],
  share: String,
  imageUrl: Option[String],
  youtubeId: Option[String]
)

object ResultGroup {
  implicit val jsonFormat = Json.format[ResultGroup]
}

case class ResultGroup(title: String, share: String, minScore: Int)

object Quiz {
  implicit val jsonFormat = Json.format[Quiz]

  def empty(id: String, title: String, quizType: QuizType, columns: Option[Int]) = quizType match {
    case PersonalityQuiz => Quiz(
      id,
      QuizHeader(title),
      Some(quizType),
      columns,
      Nil,
      None,
      Some(Seq.empty)
    )

    case KnowledgeQuiz => Quiz(
      id,
      QuizHeader(title),
      Some(quizType),
      columns,
      Nil,
      Some(Seq(
        ResultGroup(
          "Well done!",
          s"I got _/_ in '$title'",
          0
        )
      )),
      None
    )
  }
}

case class Quiz(
  id: String,
  header: QuizHeader,
  quizType: Option[QuizType],
  defaultColumns: Option[Int],
  questions: Seq[Question],
  resultGroups: Option[Seq[ResultGroup]],
  resultBuckets: Option[Seq[ResultBucket]]
)
