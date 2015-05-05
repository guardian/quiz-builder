import com.typesafe.sbt.packager.Keys._

name := "quiz-builder"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala, SbtWeb, RiffRaffArtifact)

scalaVersion := "2.11.6"

scalacOptions := List("-feature", "-deprecation")

doc in Compile <<= target.map(_ / "none")

name in Universal := normalizedName.value

riffRaffArtifactPublishPath := normalizedName.value

riffRaffPackageType := (dist in Universal).value

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "com.amazonaws" % "aws-java-sdk" % "1.9.32",
  "com.gu" %% "play-googleauth" % "0.2.1",
  "org.clapper" %% "grizzled-slf4j" % "1.0.2"
)
