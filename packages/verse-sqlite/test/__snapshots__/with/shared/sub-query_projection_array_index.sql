-- Executing SQL: Parameters: [$1=5]
select (
   select "t8"."c1"
   from (
      select json_group_array("t3"."Title") ->> 0 as "c1"
      from "Album" as "t3"
      where "t3"."Title" like 'T%'
      limit ?
   ) as "t8"
   order by "t8"."c1"
) as "c2"
from "Artist" as "t1"

