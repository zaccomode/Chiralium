CREATE TABLE IF NOT EXISTS MyTable (
  id TEXT PRIMARY KEY NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  
  url TEXT NOT NULL,
  count INTEGER NOT NULL
);