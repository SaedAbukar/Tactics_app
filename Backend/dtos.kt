import kotlinx.serialization.Serializable

// ===================
// USER DTO
// ===================
@Serializable
data class UserDto(
    val id: Int,
    val email: String,
    val role: String,
    val sessions: List<SessionDto> = emptyList(),
    val practices: List<PracticeDto> = emptyList(),
    val tactics: List<GameTacticDto> = emptyList()
)

// ===================
// SESSION DTO
// ===================
@Serializable
data class SessionDto(
    val id: Int,
    val name: String,
    val description: String,
    val steps: List<StepDto> = emptyList()
)

// ===================
// STEP DTO
// ===================
@Serializable
data class StepDto(
    val players: List<PlayerDto> = emptyList(),
    val balls: List<BallDto> = emptyList(),
    val goals: List<GoalDto> = emptyList(),
    val cones: List<ConeDto> = emptyList(),
    val teams: List<TeamDto> = emptyList(),
    val formations: List<FormationDto> = emptyList()
)

// ===================
// PRACTICE DTO
// ===================
@Serializable
data class PracticeDto(
    val id: Int,
    val name: String,
    val description: String,
    val sessions: List<SessionDto> = emptyList()
)

// ===================
// GAMETACTIC DTO
// ===================
@Serializable
data class GameTacticDto(
    val id: Int,
    val name: String,
    val description: String,
    val sessions: List<SessionDto> = emptyList()
)

// ===================
// PLAYER, BALL, GOAL, CONE DTOs
// ===================
@Serializable
data class PlayerDto(
    val id: Int,
    val number: Int,
    val x: Int,
    val y: Int,
    val color: String,
    val team: TeamDto? = null
)

@Serializable
data class BallDto(
    val id: Int,
    val x: Int,
    val y: Int,
    val color: String? = null
)

@Serializable
data class GoalDto(
    val id: Int,
    val x: Int,
    val y: Int,
    val width: Int,
    val depth: Int,
    val color: String? = null
)

@Serializable
data class ConeDto(
    val id: Int,
    val x: Int,
    val y: Int,
    val color: String? = null
)

@Serializable
data class TeamDto(
    val id: Int,
    val name: String,
    val color: String
)

// ===================
// FORMATION DTO
// ===================
@Serializable
data class FormationDto(
    val id: Int,
    val name: String,
    val teams: List<TeamFormationDto> = emptyList()
)

@Serializable
data class TeamFormationDto(
    val team: TeamDto,
    val positions: List<PositionDto> = emptyList()
)

@Serializable
data class PositionDto(
    val x: Double,
    val y: Double
)

