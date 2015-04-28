name := """quiz-builder"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.1"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "com.amazonaws" % "aws-java-sdk" % "1.9.32",
  "com.gu" %% "pan-domain-auth-core" % "0.2.6",
  "com.gu" %% "pan-domain-auth-play" % "0.2.6",
  "org.clapper" %% "grizzled-slf4j" % "1.0.2"
)
