-- ============================================================================
-- COMMON DEFINITION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Install Extentions
-- ----------------------------------------------------------------------------
-- Encrypto Extension for Password
CREATE EXTENSION pgcrypto;

-- ----------------------------------------------------------------------------
-- CREATE COMMON TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS common (
  id          serial,
  name        varchar(20) NOT NULL, -- 設定名
  discription text        NOT NULL, -- 説明
  int01       integer,
  int02       integer,
  int03       integer,
  int04       integer,
  int05       integer,
  int06       integer,
  int07       integer,
  int08       integer,
  int09       integer,
  int10       integer,
  text01      text,
  text02      text,
  text03      text,
  text04      text,
  text05      text,
  text06      text,
  text07      text,
  text08      text,
  text09      text,
  text10      text,

  PRIMARY KEY (id),
  UNIQUE (name)
);
