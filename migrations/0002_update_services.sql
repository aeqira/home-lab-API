PRAGMA foreign_keys = OFF;

ALTER TABLE Services RENAME TO Services_old;

CREATE TABLE Services (
  ID TEXT PRIMARY KEY,
  Name TEXT NOT NULL,
  Status INTEGER NOT NULL,
  Description TEXT DEFAULT '',
  CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (Status) REFERENCES Statuses(ID)
);

INSERT INTO Services (
  ID,
  Name,
  Status,
  Description,
  CreatedAt,
  UpdatedAt
)
SELECT
  ID,
  Name,
  Status,
  COALESCE(Description, ''),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM Services_old;

DROP TABLE Services_old;

PRAGMA foreign_keys = ON;