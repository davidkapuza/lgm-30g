-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "stat_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "website_id" INTEGER NOT NULL,
    "visit_count" INTEGER DEFAULT 0,
    "last_visit_time" TIMESTAMP(6),
    "total_time_spent" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("stat_id")
);

-- CreateTable
CREATE TABLE "website_categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "website_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "websites" (
    "website_id" SERIAL NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "category_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "websites_pkey" PRIMARY KEY ("website_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_statistics_user" ON "statistics"("user_id");

-- CreateIndex
CREATE INDEX "idx_statistics_website" ON "statistics"("website_id");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_user_id_website_id_key" ON "statistics"("user_id", "website_id");

-- CreateIndex
CREATE INDEX "idx_category_name" ON "website_categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "websites_domain_key" ON "websites"("domain");

-- CreateIndex
CREATE INDEX "idx_websites_category" ON "websites"("category_id");

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "websites"("website_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "website_categories"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
