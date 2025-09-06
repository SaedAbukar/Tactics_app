import jakarta.persistence.*

// ===================
// USER
// ===================
@Entity
@Table(name = "user")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false, unique = true)
    val email: String = "",

    @Column(nullable = false)
    val password: String = "",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: UserRole = UserRole.USER
)

enum class UserRole { USER, ADMIN }
enum class AccessRole { OWNER, EDITOR, VIEWER }

// ===================
// USER GROUPS
// ===================
@Entity
@Table(name = "user_group")
data class UserGroup(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false)
    val name: String = "",

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @ManyToMany
    @JoinTable(
        name = "user_group_member",
        joinColumns = [JoinColumn(name = "group_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    val members: List<User> = emptyList()
)

// ===================
// SESSION
// ===================
@Entity
@Table(name = "session")
data class Session(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false)
    val name: String = "",

    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String = "",

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val owner: User,

    @OneToMany(mappedBy = "session", cascade = [CascadeType.ALL])
    val steps: List<Step> = emptyList(),

    @OneToMany(mappedBy = "session", cascade = [CascadeType.ALL])
    val userAccess: List<UserSessionAccess> = emptyList(),

    @OneToMany(mappedBy = "session", cascade = [CascadeType.ALL])
    val groupAccess: List<GroupSessionAccess> = emptyList()
)

// ===================
// USER / GROUP SESSION ACCESS
// ===================
@Entity
@Table(name = "user_session")
data class UserSessionAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    val session: Session,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "group_session")
data class GroupSessionAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    val group: UserGroup,

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    val session: Session,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: AccessRole = AccessRole.VIEWER
)

// ===================
// PRACTICE
// ===================
@Entity
@Table(name = "practice")
data class Practice(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false)
    val name: String = "",

    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String = "",

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val owner: User,

    @Column(name = "is_premade", nullable = false)
    val isPremade: Boolean = false,

    @ManyToMany(mappedBy = "practices")
    val sessions: List<Session> = emptyList(),

    @OneToMany(mappedBy = "practice", cascade = [CascadeType.ALL])
    val userAccess: List<UserPracticeAccess> = emptyList(),

    @OneToMany(mappedBy = "practice", cascade = [CascadeType.ALL])
    val groupAccess: List<GroupPracticeAccess> = emptyList()
)

@Entity
@Table(name = "user_practice")
data class UserPracticeAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne
    @JoinColumn(name = "practice_id", nullable = false)
    val practice: Practice,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "group_practice")
data class GroupPracticeAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    val group: UserGroup,

    @ManyToOne
    @JoinColumn(name = "practice_id", nullable = false)
    val practice: Practice,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: AccessRole = AccessRole.VIEWER
)

// ===================
// GAMETACTIC
// ===================
@Entity
@Table(name = "gameTactic")
data class GameTactic(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @Column(nullable = false)
    val name: String = "",

    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String = "",

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val owner: User,

    @Column(name = "is_premade", nullable = false)
    val isPremade: Boolean = false,

    @ManyToMany(mappedBy = "gameTactics")
    val sessions: List<Session> = emptyList(),

    @OneToMany(mappedBy = "gameTactic", cascade = [CascadeType.ALL])
    val userAccess: List<UserGameTacticAccess> = emptyList(),

    @OneToMany(mappedBy = "gameTactic", cascade = [CascadeType.ALL])
    val groupAccess: List<GroupGameTacticAccess> = emptyList()
)

@Entity
@Table(name = "user_gameTactic")
data class UserGameTacticAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne
    @JoinColumn(name = "gameTactic_id", nullable = false)
    val gameTactic: GameTactic,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "group_gameTactic")
data class GroupGameTacticAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    val group: UserGroup,

    @ManyToOne
    @JoinColumn(name = "gameTactic_id", nullable = false)
    val gameTactic: GameTactic,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: AccessRole = AccessRole.VIEWER
)

// ===================
// TEAM, PLAYER, BALL, GOAL, CONE
// ===================
@Entity
@Table(name = "team")
data class Team(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    val name: String = "",
    val color: String = ""
)

@Entity
@Table(name = "player")
data class Player(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    val x: Int = 0,
    val y: Int = 0,
    val number: Int = 0,
    val color: String = "",

    @ManyToOne
    @JoinColumn(name = "team_id")
    val team: Team? = null
)

@Entity
@Table(name = "ball")
data class Ball(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    val color: String? = null,
    val x: Int = 0,
    val y: Int = 0
)

@Entity
@Table(name = "goal")
data class Goal(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    val x: Int = 0,
    val y: Int = 0,
    val width: Int = 0,
    val depth: Int = 0,
    val color: String? = null
)

@Entity
@Table(name = "cone")
data class Cone(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    val x: Int = 0,
    val y: Int = 0,
    val color: String? = null
)

// ===================
// FORMATION
// ===================
@Entity
@Table(name = "formation")
data class Formation(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    val name: String = "",

    @OneToMany(mappedBy = "formation", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val positions: List<FormationPosition> = emptyList()
)


@Entity
@Table(name = "formation_position")
data class FormationPosition(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "formation_id", nullable = false)
    val formation: Formation,

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    val team: Team,

    val x: Double = 0.0,
    val y: Double = 0.0
)

// ===================
// STEP
// ===================
@Entity
@Table(name = "step")
data class Step(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    val session: Session,

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val players: List<Player> = emptyList(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val balls: List<Ball> = emptyList(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val goals: List<Goal> = emptyList(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val teams: List<Team> = emptyList(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val formations: List<Formation> = emptyList(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val cones: List<Cone> = emptyList()
)
