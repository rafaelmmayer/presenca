/*
  Warnings:

  - You are about to drop the column `endHour` on the `ClassTime` table. All the data in the column will be lost.
  - You are about to drop the column `endMinute` on the `ClassTime` table. All the data in the column will be lost.
  - You are about to drop the column `startHour` on the `ClassTime` table. All the data in the column will be lost.
  - You are about to drop the column `startMinute` on the `ClassTime` table. All the data in the column will be lost.
  - Added the required column `end` to the `ClassTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `ClassTime` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClassTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayOfWeek" INTEGER NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "classId" INTEGER NOT NULL,
    CONSTRAINT "ClassTime_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClassTime" ("classId", "dayOfWeek", "id") SELECT "classId", "dayOfWeek", "id" FROM "ClassTime";
DROP TABLE "ClassTime";
ALTER TABLE "new_ClassTime" RENAME TO "ClassTime";
PRAGMA foreign_key_check("ClassTime");
PRAGMA foreign_keys=ON;
