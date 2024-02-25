-- Executing SQL: Parameters: []
select (json_group_array(json_array("t1"."ArtistId", "t1"."Name")) -> 0) ->> 1 as "c1", json_group_array(json_array("t1"."ArtistId", "t1"."Name"))
from "Artist" as "t1"

