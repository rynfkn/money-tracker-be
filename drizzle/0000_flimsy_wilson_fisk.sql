CREATE TABLE "Categories" (
	"categoryId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"transactionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"walletId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	"transaction_date" timestamp NOT NULL,
	"amount" numeric(19, 4) NOT NULL,
	"description" text NOT NULL,
	"transactionType" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp (0) DEFAULT now() NOT NULL,
	CONSTRAINT "User_username_unique" UNIQUE("username"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"walletId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"walletName" varchar(255) NOT NULL,
	"balance" numeric(19, 4) NOT NULL,
	"updated_at" timestamp (0) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_walletId_wallets_walletId_fk" FOREIGN KEY ("walletId") REFERENCES "public"."wallets"("walletId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_Categories_categoryId_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."Categories"("categoryId") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE cascade ON UPDATE no action;