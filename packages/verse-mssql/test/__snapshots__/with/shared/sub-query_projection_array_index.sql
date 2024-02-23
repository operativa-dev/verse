-- Executing SQL: Parameters: []
select (
   select "t8"."c1"
   from (
      select json_query("t7"."c0", '$[0]') as "c1"
      from (
         select '[' + (string_agg(trim('[]' from json_modify('[]', 'append $', "t6"."Title")), ',') + ']') as "c0"
         from (
            select "t5"."Title"
            from (
               select "t3"."Title"
               from "Album" as "t3"
               where "t3"."Title" like 'T%'
            ) as "t5"
            order by 1 offset 0 rows fetch next 5 rows only
         ) as "t6"
      ) as "t7"
   ) as "t8"
   order by "t8"."c1" offset 0 rows
) as "c2"
from "Artist" as "t1"

