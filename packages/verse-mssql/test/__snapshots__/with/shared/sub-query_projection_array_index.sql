-- Executing SQL: Parameters: [$1=5]
select (
   select "t8"."c1"
   from (
      select json_query('[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t6"."Title")), ',') + ']'), '$[0]') as "c1"
      from (
         select "t3"."Title"
         from "Album" as "t3"
         where "t3"."Title" like 'T%'
         order by 1 offset 0 rows fetch next @p0 rows only
      ) as "t6"
   ) as "t8"
   order by "t8"."c1" offset 0 rows
) as "c2"
from "Artist" as "t1"

