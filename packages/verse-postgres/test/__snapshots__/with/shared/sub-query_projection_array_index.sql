-- Executing SQL: Parameters: [$1=5]
select (
   select "t8"."c1"
   from (
      select json_agg("t6"."Title") ->> 0 as "c1"
      from (
         select "t3"."Title"
         from "Album" as "t3"
         where "t3"."Title" like 'T%'
         limit $1
      ) as "t6"
   ) as "t8"
   order by "t8"."c1"
) as "c2"
from "Artist" as "t1"

