-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayOfWeek" INTEGER NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "classId" INTEGER,
    CONSTRAINT "ClassTime_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ClassTime" ("classId", "dayOfWeek", "end", "id", "start") SELECT "classId", "dayOfWeek", "end", "id", "start" FROM "ClassTime";
DROP TABLE "ClassTime";
ALTER TABLE "new_ClassTime" RENAME TO "ClassTime";
PRAGMA foreign_key_check("ClassTime");
PRAGMA foreign_keys=ON;
