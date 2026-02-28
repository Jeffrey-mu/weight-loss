-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "nickname" TEXT,
    "avatar" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "height" REAL,
    "initialWeight" REAL,
    "targetWeight" REAL,
    "targetDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("age", "avatar", "createdAt", "email", "gender", "height", "id", "initialWeight", "nickname", "password", "targetDate", "targetWeight", "updatedAt") SELECT "age", "avatar", "createdAt", "email", "gender", "height", "id", "initialWeight", "nickname", "password", "targetDate", "targetWeight", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
