-- Executing SQL: Parameters: []
select json_group_array(json_array("t1"."ArtistId", "t1"."Name")) -> 0 as "c1", (json_group_array(json_array("t1"."ArtistId", "t1"."Name")) -> 0) ->> 1 as "c2", json_group_array(json_array("t1"."ArtistId", "t1"."Name")) -> 0 as "c4", (json_group_array(json_array("t1"."ArtistId", "t1"."Name")) -> 0) ->> 0 as "c3"
from "Artist" as "t1"

