-- Executing SQL: Parameters: [$1='Miles Ahead']
select ('Title: ' || t1.Title) || '!' c0
from Album t1
where t1.Title = :0

