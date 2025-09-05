-- ===================
-- USER
-- ===================
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user','admin') NOT NULL DEFAULT 'user'
);

-- ===================
-- SESSION
-- ===================
CREATE TABLE session (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- ===================
-- PLAYER
-- ===================
CREATE TABLE player (
    id INT PRIMARY KEY AUTO_INCREMENT,
    x INT NOT NULL,
    y INT NOT NULL,
    number INT NOT NULL,
    color VARCHAR(50) NOT NULL,
    team_id INT,
    FOREIGN KEY (team_id) REFERENCES team(id)
);

-- ===================
-- BALL
-- ===================
CREATE TABLE ball (
    id INT PRIMARY KEY AUTO_INCREMENT,
    color VARCHAR(50),
    x INT NOT NULL,
    y INT NOT NULL
);

-- ===================
-- GOAL
-- ===================
CREATE TABLE goal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    x INT NOT NULL,
    y INT NOT NULL,
    width INT NOT NULL,
    depth INT NOT NULL,
    color VARCHAR(50)
);

-- ===================
-- TEAM
-- ===================
CREATE TABLE team (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL
);

-- ===================
-- FORMATION
-- ===================
CREATE TABLE formation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Positions within a formation (linked to teams)
CREATE TABLE formation_position (
    id INT PRIMARY KEY AUTO_INCREMENT,
    formation_id INT NOT NULL,
    team_id INT NOT NULL,
    x DECIMAL(5,2) NOT NULL, -- percentage (0–1) scaled as decimal
    y DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (formation_id) REFERENCES formation(id),
    FOREIGN KEY (team_id) REFERENCES team(id)
);

-- ===================
-- PRACTICE
-- ===================
CREATE TABLE practice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- ===================
-- GAMETACTIC
-- ===================
CREATE TABLE gameTactic (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- ===================
-- STEP
-- ===================
CREATE TABLE step (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES session(id)
);

-- ===================
-- CONE
-- ===================
CREATE TABLE cone (
    id INT PRIMARY KEY AUTO_INCREMENT,
    x INT NOT NULL,
    y INT NOT NULL,
    color VARCHAR(50)
);

-- ===================
-- RELATIONSHIP TABLES
-- ===================

-- GameTactic ↔ Session
CREATE TABLE has_gameTactic_session (
    gameTactic_id INT,
    session_id INT,
    PRIMARY KEY (gameTactic_id, session_id),
    FOREIGN KEY (gameTactic_id) REFERENCES gameTactic(id),
    FOREIGN KEY (session_id) REFERENCES session(id)
);

-- Practice ↔ Session
CREATE TABLE has_practice_session (
    practice_id INT,
    session_id INT,
    PRIMARY KEY (practice_id, session_id),
    FOREIGN KEY (practice_id) REFERENCES practice(id),
    FOREIGN KEY (session_id) REFERENCES session(id)
);

-- Step ↔ Goal
CREATE TABLE has_step_goal (
    step_id INT,
    goal_id INT,
    PRIMARY KEY (step_id, goal_id),
    FOREIGN KEY (step_id) REFERENCES step(id),
    FOREIGN KEY (goal_id) REFERENCES goal(id)
);

-- Step ↔ Player
CREATE TABLE has_step_player (
    step_id INT,
    player_id INT,
    PRIMARY KEY (step_id, player_id),
    FOREIGN KEY (step_id) REFERENCES step(id),
    FOREIGN KEY (player_id) REFERENCES player(id)
);

-- Step ↔ Ball
CREATE TABLE has_step_ball (
    step_id INT,
    ball_id INT,
    PRIMARY KEY (step_id, ball_id),
    FOREIGN KEY (step_id) REFERENCES step(id),
    FOREIGN KEY (ball_id) REFERENCES ball(id)
);

-- Step ↔ Team
CREATE TABLE has_step_team (
    step_id INT,
    team_id INT,
    PRIMARY KEY (step_id, team_id),
    FOREIGN KEY (step_id) REFERENCES step(id),
    FOREIGN KEY (team_id) REFERENCES team(id)
);

-- Step ↔ Formation
CREATE TABLE step_formation (
    step_id INT,
    formation_id INT,
    PRIMARY KEY (step_id, formation_id),
    FOREIGN KEY (step_id) REFERENCES step(id),
    FOREIGN KEY (formation_id) REFERENCES formation(id)
);

-- Step ↔ Cone
CREATE TABLE step_cone (
    step_id INT,
    cone_id INT,
    PRIMARY KEY (step_id, cone_id),
    FOREIGN KEY (step_id) REFERENCES step(id),
    FOREIGN KEY (cone_id) REFERENCES cone(id)
);
