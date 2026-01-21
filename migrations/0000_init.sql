CREATE TYPE "public"."agency_type" AS ENUM('inmobiliaria', 'constructora');--> statement-breakpoint
CREATE TYPE "public"."development_status" AS ENUM('pozo', 'construccion', 'terminado');--> statement-breakpoint
CREATE TYPE "public"."operation_type" AS ENUM('venta', 'alquiler', 'temporario');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('pre-registered', 'completed');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('basic', 'professional', 'enterprise');--> statement-breakpoint
CREATE TABLE "agencies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"address" text,
	"website" varchar(255),
	"description" text,
	"logo" varchar,
	"type" "agency_type" DEFAULT 'inmobiliaria' NOT NULL,
	"is_active" boolean DEFAULT false,
	"subscription_plan" "subscription_plan" DEFAULT 'basic',
	"subscription_status" varchar DEFAULT 'pending',
	"owner_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "agencies_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"image_url" varchar NOT NULL,
	"link_url" varchar,
	"size" varchar(20) NOT NULL,
	"position" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"agency_id" varchar,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"province" varchar(100),
	"country" varchar(100) DEFAULT 'Argentina',
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "locations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(12, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"area" integer,
	"bedrooms" integer,
	"bathrooms" integer,
	"garages" integer,
	"address" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"images" text[],
	"operation_type" "operation_type" NOT NULL,
	"development_status" "development_status",
	"is_featured" boolean DEFAULT false,
	"is_credit_suitable" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"agency_id" varchar NOT NULL,
	"location_id" varchar,
	"category_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "properties_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "property_categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "property_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"password" varchar,
	"registration_status" "registration_status" DEFAULT 'pre-registered',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "banners" ADD CONSTRAINT "banners_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_category_id_property_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."property_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");