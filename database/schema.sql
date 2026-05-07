CREATE DATABASE IF NOT EXISTS defaultdb;
USE defaultdb;

-- Tabella utenti
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabella tipi (es. petto, schiena, gambe...)
CREATE TABLE types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_type_per_user (name, user_id)
);

-- Tabella esercizi
CREATE TABLE exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    reps VARCHAR(50),
    sets VARCHAR(50),
    peso VARCHAR(50),
    order_index INT DEFAULT 0,
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES types(id) ON DELETE CASCADE,
    INDEX idx_user_type (user_id, type_id),
    INDEX idx_order (order_index)
);

-- Tabella log completamenti
CREATE TABLE workout_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exercise_id INT NOT NULL,
    done_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    INDEX idx_exercise (exercise_id),
    INDEX idx_done_at (done_at)
);
