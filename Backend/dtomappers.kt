// ===================
// ENTITY → DTO MAPPERS
// ===================
object DtoMapper {

    fun userToDto(user: User): UserDto = UserDto(
        id = user.id,
        email = user.email,
        role = user.role.name.lowercase(),
        sessions = userSessionsToDto(user),
        practices = userPracticesToDto(user),
        tactics = userTacticsToDto(user)
    )

    private fun userSessionsToDto(user: User): List<SessionDto> =
        user.userAccess.map { it.session }.distinct().map { sessionToDto(it) }

    private fun userPracticesToDto(user: User): List<PracticeDto> =
        user.userAccess.flatMap { it.practice?.let { listOf(it) } ?: emptyList() }
            .distinct()
            .map { practiceToDto(it) }

    private fun userTacticsToDto(user: User): List<GameTacticDto> =
        user.userAccess.flatMap { it.gameTactic?.let { listOf(it) } ?: emptyList() }
            .distinct()
            .map { gameTacticToDto(it) }

    fun sessionToDto(session: Session): SessionDto = SessionDto(
        id = session.id,
        name = session.name,
        description = session.description,
        steps = session.steps.map { stepToDto(it) }
    )

    fun stepToDto(step: Step): StepDto = StepDto(
        players = step.players.map { playerToDto(it) },
        balls = step.balls.map { ballToDto(it) },
        goals = step.goals.map { goalToDto(it) },
        cones = step.cones.map { coneToDto(it) },
        teams = step.teams.map { teamToDto(it) },
        formations = step.formations.map { formationToDto(it) }
    )

    fun practiceToDto(practice: Practice): PracticeDto = PracticeDto(
        id = practice.id,
        name = practice.name,
        description = practice.description,
        sessions = practice.sessions.map { sessionToDto(it) }
    )

    fun gameTacticToDto(tactic: GameTactic): GameTacticDto = GameTacticDto(
        id = tactic.id,
        name = tactic.name,
        description = tactic.description,
        sessions = tactic.sessions.map { sessionToDto(it) }
    )

    fun playerToDto(player: Player): PlayerDto = PlayerDto(
        id = player.id,
        number = player.number,
        x = player.x,
        y = player.y,
        color = player.color,
        team = player.team?.let { teamToDto(it) }
    )

    fun ballToDto(ball: Ball): BallDto = BallDto(
        id = ball.id,
        x = ball.x,
        y = ball.y,
        color = ball.color
    )

    fun goalToDto(goal: Goal): GoalDto = GoalDto(
        id = goal.id,
        x = goal.x,
        y = goal.y,
        width = goal.width,
        depth = goal.depth,
        color = goal.color
    )

    fun coneToDto(cone: Cone): ConeDto = ConeDto(
        id = cone.id,
        x = cone.x,
        y = cone.y,
        color = cone.color
    )

    fun teamToDto(team: Team): TeamDto = TeamDto(
        id = team.id,
        name = team.name,
        color = team.color
    )

    fun formationToDto(formation: Formation): FormationDto {
        val teamPositions = formation.positions.groupBy { it.team }
        val teams = teamPositions.map { (team, positions) ->
            TeamFormationDto(
                team = teamToDto(team),
                positions = positions.map { PositionDto(it.x, it.y) }
            )
        }
        return FormationDto(
            name = formation.name,
            teams = teams
        )
    }
}
