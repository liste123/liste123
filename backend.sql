CREATE OR REPLACE FUNCTION "public"."beta_get_project"(
  "uuid" VARCHAR(20)
)
RETURNS SETOF "public"."beta_projects_index" AS $$
#variable_conflict use_variable
BEGIN
  RETURN QUERY 
  SELECT
    "p"."uuid",
    "p"."title",
    "p"."updated_at",
    COALESCE("a"."data" ->> 'uname', CONCAT(LEFT("a"."uuid", 3), RIGHT("a"."uuid", 3)))::text AS "uname"
  FROM "beta_projects" AS "p"
  LEFT JOIN "beta_accounts" AS "a"
  ON "a"."uuid" = "p"."account_uuid"
  WHERE "p"."uuid" = "uuid"
  LIMIT 1;
END; $$
LANGUAGE plpgsql IMMUTABLE STRICT;