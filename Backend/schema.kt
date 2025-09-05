enum class UserRole { USER, ADMIN }

data class User(
    val id: Int,
    val email: String,
    val password: String,
    val role: UserRole,
    val sessions: List<Session> = emptyList(),
    val practices: List<Practice> = emptyList(),
    val tactics: List<GameTactic> = emptyList()
)

data class Session(
    val id: Int,
    val name: String,
    val description: String,
    val steps: List<Step> = emptyList()
)

data class Step(
    val id: Int,
    val players: List<Player> = emptyList(),
    val balls: List<Ball> = emptyList(),
    val goals: List<Goal> = emptyList(),
    val cones: List<Cone> = emptyList(),
    val teams: List<Team> = emptyList(),
    val formations: List<Formation> = emptyList()
)

data class Player(
    val id: Int,
    val x: Int,
    val y: Int,
    val number: Int,
    val color: String,
    val team: Team? = null
)

data class Ball(
    val id: Int,
    val x: Int,
    val y: Int,
    val color: String? = null
)

data class Goal(
    val id: Int,
    val x: Int,
    val y: Int,
    val width: Int,
    val depth: Int,
    val color: String? = null
)

data class Cone(
    val id: Int,
    val x: Int,
    val y: Int,
    val color: String? = null
)

data class Team(
    val id: Int,
    val name: String,
    val color: String
)

data class Formation(
    val id: Int,
    val name: String,
    val teams: List<TeamFormation> = emptyList()
)

data class TeamFormation(
    val team: Team,
    val positions: List<Position> = emptyList()
)

data class Position(
    val x: Double,
    val y: Double
)

data class Practice(
    val id: Int,
    val name: String,
    val description: String,
    val sessions: List<Session> = emptyList()
)

data class GameTactic(
    val id: Int,
    val name: String,
    val description: String,
    val sessions: List<Session> = emptyList()
)
