import com.typesafe.sbt.packager.Keys._

name := "quiz-builder"

version := "1.0"

sources in (Compile, doc) := Seq.empty

publishArtifact in (Compile, packageDoc) := false

ivyScala := ivyScala.value map { _.copy(overrideScalaVersion = true) }

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
  ws,
  "com.amazonaws" % "aws-java-sdk" % "1.9.32",
  "com.gu" %% "pan-domain-auth-play" % "0.2.7",
  "org.clapper" %% "grizzled-slf4j" % "1.0.2"
)

lazy val mainProject = project.in(file("."))
  .enablePlugins(PlayScala, RiffRaffArtifact)
  .settings(Defaults.coreDefaultSettings: _*)
  .settings(
    name in Universal := normalizedName.value,
    riffRaffPackageType := (packageZipTarball in config("universal")).value,
    riffRaffArtifactResources ++= Seq(
      baseDirectory.value / "cloudformation" / "quiz-builder.json" ->
        "packages/cloudformation/quiz-builder.json"
    )
  )
