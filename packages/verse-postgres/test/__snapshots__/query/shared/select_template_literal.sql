-- Executing SQL: Parameters: [$1='Miles Ahead']
select ('Title: ' || "t1"."Title") || '!' as "c0"
from "Album" as "t1"
where "t1"."Title" = $1

