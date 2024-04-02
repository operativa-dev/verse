-- Executing SQL: Parameters: [$1=5]
select "t1"."ArtistId", "t1"."Name", "t1"."ArtistId" as "c0", "t1"."Name" as "c1"
from "Artist" as "t1"
limit $1

