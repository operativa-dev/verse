-- Executing SQL: Parameters: [$1=5]
select (
   select t8.c1
   from (
      select json_query(json_arrayagg(t3.Title returning varchar2(32767)), '$[0]') c1
      from Album t3
      where t3.Title like 'T%'
      fetch next :0 rows only
   ) t8
   order by t8.c1
) c2
from Artist t1

