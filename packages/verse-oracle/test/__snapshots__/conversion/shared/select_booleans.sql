-- Executing SQL: Parameters: [$1='41', $2=1, $3=null]
insert into Entity (Num, Bool, "Date") values (:0, :1, :2)

-- Executing SQL: Parameters: [$1='41', $2='<UUID>', $3=Mon Oct 11 1976 12:13:14 GMT+0200 (South Africa Standard Time), $4=1, $5=1]
select t3.c0, t3.c1, t3.Bool, t3.c2, t3.c3, t3.c4, t3.c5, t3.c6
from (
   select 1 c0, 0 c1, t1.Bool, null c2, null c3, :1 c4, :2 c5, :3 c6
   from Entity t1
   where (t1.Num = :0) and (t1.Bool = 1)
) t3
where (t3.c0 = :4) and (t3.Bool = 1)
fetch next 2 rows only

