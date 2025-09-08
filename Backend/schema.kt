package org.sportstechsolutions.apitacticsapp.model

import jakarta.persistence.*

@Entity
@Table(name = "app_user") // ✅ avoid reserved keyword 'user'
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    var email: String = "",
    var password: String = "",

    @Enumerated(EnumType.STRING)
    var role: UserRole = UserRole.USER,

    @OneToMany(mappedBy = "owner", cascade = [CascadeType.ALL])
    val sessions: MutableList<Session> = mutableListOf(),

    @OneToMany(mappedBy = "owner", cascade = [CascadeType.ALL])
    val practices: MutableList<Practice> = mutableListOf(),

    @OneToMany(mappedBy = "owner", cascade = [CascadeType.ALL])
    val gameTactics: MutableList<GameTactic> = mutableListOf()
)

enum class UserRole { USER, ADMIN }
enum class AccessRole { OWNER, EDITOR, VIEWER }

@Entity
@Table(name = "user_group")
data class UserGroup(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    var name: String = "",
    var description: String? = null,

    @ManyToMany
    @JoinTable(
        name = "user_group_member",
        joinColumns = [JoinColumn(name = "group_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    val members: MutableList<User> = mutableListOf()
)

@Entity
@Table(name = "session")
data class Session(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    var name: String = "",
    var description: String = "",

    @ManyToOne
    @JoinColumn(name = "user_id")
    var owner: User? = null,

    @OneToMany(mappedBy = "session", cascade = [CascadeType.ALL], orphanRemoval = true)
    val steps: MutableList<Step> = mutableListOf(),

    @OneToMany(mappedBy = "session", cascade = [CascadeType.ALL], orphanRemoval = true)
    val userAccess: MutableList<UserSessionAccess> = mutableListOf(),

    @OneToMany(mappedBy = "session", cascade = [CascadeType.ALL], orphanRemoval = true)
    val groupAccess: MutableList<GroupSessionAccess> = mutableListOf(),

    @ManyToMany
    @JoinTable(
        name = "session_practice",
        joinColumns = [JoinColumn(name = "session_id")],
        inverseJoinColumns = [JoinColumn(name = "practice_id")]
    )
    val practices: MutableList<Practice> = mutableListOf(),

    @ManyToMany
    @JoinTable(
        name = "session_game_tactic",
        joinColumns = [JoinColumn(name = "session_id")],
        inverseJoinColumns = [JoinColumn(name = "game_tactic_id")]
    )
    val gameTactics: MutableList<GameTactic> = mutableListOf()
)

@Entity
@Table(name = "user_session")
data class UserSessionAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: User? = null,

    @ManyToOne
    @JoinColumn(name = "session_id")
    var session: Session? = null,

    @Enumerated(EnumType.STRING)
    var role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "group_session")
data class GroupSessionAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "group_id")
    var group: UserGroup? = null,

    @ManyToOne
    @JoinColumn(name = "session_id")
    var session: Session? = null,

    @Enumerated(EnumType.STRING)
    var role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "practice")
data class Practice(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    var name: String = "",
    var description: String = "",
    var is_premade: Boolean = false, // ✅ snake_case

    @ManyToOne
    @JoinColumn(name = "user_id")
    var owner: User? = null,

    @OneToMany(mappedBy = "practice", cascade = [CascadeType.ALL], orphanRemoval = true)
    val userAccess: MutableList<UserPracticeAccess> = mutableListOf(),

    @OneToMany(mappedBy = "practice", cascade = [CascadeType.ALL], orphanRemoval = true)
    val groupAccess: MutableList<GroupPracticeAccess> = mutableListOf(),

    @ManyToMany(mappedBy = "practices")
    val sessions: MutableList<Session> = mutableListOf()
)

@Entity
@Table(name = "user_practice")
data class UserPracticeAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: User? = null,

    @ManyToOne
    @JoinColumn(name = "practice_id")
    var practice: Practice? = null,

    @Enumerated(EnumType.STRING)
    var role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "group_practice")
data class GroupPracticeAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "group_id")
    var group: UserGroup? = null,

    @ManyToOne
    @JoinColumn(name = "practice_id")
    var practice: Practice? = null,

    @Enumerated(EnumType.STRING)
    var role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "game_tactic")
data class GameTactic(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    var name: String = "",
    var description: String = "",
    var is_premade: Boolean = false,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var owner: User? = null,

    @OneToMany(mappedBy = "gameTactic", cascade = [CascadeType.ALL], orphanRemoval = true)
    val userAccess: MutableList<UserGameTacticAccess> = mutableListOf(),

    @OneToMany(mappedBy = "gameTactic", cascade = [CascadeType.ALL], orphanRemoval = true)
    val groupAccess: MutableList<GroupGameTacticAccess> = mutableListOf(),

    @ManyToMany(mappedBy = "gameTactics")
    val sessions: MutableList<Session> = mutableListOf()
)

@Entity
@Table(name = "user_game_tactic") // ✅ renamed
data class UserGameTacticAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: User? = null,

    @ManyToOne
    @JoinColumn(name = "game_tactic_id")
    var gameTactic: GameTactic? = null,

    @Enumerated(EnumType.STRING)
    var role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "group_game_tactic") // ✅ renamed
data class GroupGameTacticAccess(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "group_id")
    var group: UserGroup? = null,

    @ManyToOne
    @JoinColumn(name = "game_tactic_id")
    var gameTactic: GameTactic? = null,

    @Enumerated(EnumType.STRING)
    var role: AccessRole = AccessRole.VIEWER
)

@Entity
@Table(name = "team")
data class Team(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    var name: String = "",
    var color: String = ""
)

@Entity
@Table(name = "player")
data class Player(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    var x: Int = 0,
    var y: Int = 0,
    var number: Int = 0,
    var color: String = "",

    @ManyToOne
    @JoinColumn(name = "team_id")
    var team: Team? = null
)

@Entity
@Table(name = "ball")
data class Ball(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    var x: Int = 0,
    var y: Int = 0,
    var color: String? = null
)

@Entity
@Table(name = "goal")
data class Goal(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    var x: Int = 0,
    var y: Int = 0,
    var width: Int = 0,
    var depth: Int = 0,
    var color: String? = null
)

@Entity
@Table(name = "cone")
data class Cone(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    var x: Int = 0,
    var y: Int = 0,
    var color: String? = null
)

@Entity
@Table(name = "formation")
data class Formation(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,
    var name: String = "",

    @OneToMany(mappedBy = "formation", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val positions: MutableList<FormationPosition> = mutableListOf()
)

@Entity
@Table(name = "formation_position")
data class FormationPosition(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "formation_id")
    var formation: Formation? = null,

    @ManyToOne
    @JoinColumn(name = "team_id")
    var team: Team? = null,

    var x: Double = 0.0,
    var y: Double = 0.0
)

@Entity
@Table(name = "step")
data class Step(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    @ManyToOne
    @JoinColumn(name = "session_id")
    var session: Session? = null,

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val players: MutableList<Player> = mutableListOf(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val balls: MutableList<Ball> = mutableListOf(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val goals: MutableList<Goal> = mutableListOf(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val teams: MutableList<Team> = mutableListOf(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val formations: MutableList<Formation> = mutableListOf(),

    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "step_id")
    val cones: MutableList<Cone> = mutableListOf()
)
