-- Executing SQL: Parameters: [$1='B%', $2=10]
select t1.ArtistId, t1.Name, (
   select json_query(json_query(t6.c0, '$[0]'), '$[1]') c1
   from (
      select json_arrayagg(json_array(t4.AlbumId, t4.Title, t4.ArtistId) returning varchar2(32767)) c0
      from Album t4
      where t4.ArtistId = t1.ArtistId
   ) t6
   where json_query(json_query(t6.c0, '$[0]'), '$[1]') like :0
) c2
from Artist t1
fetch next :1 rows only

