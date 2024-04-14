-- Executing SQL: Parameters: []
select ('Title: ' || t1.Title) || '!' c0
from Album t1
where t1.Title = 'Miles Ahead'
fetch next 2 rows only

