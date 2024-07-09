-- Executing SQL: Parameters: [$1='My Blog', $2='This is my blog']
insert into "Blog" ("Name", "Description") values (?, ?) returning "Id"

-- Executing SQL: Parameters: []
select "t1"."Id", "t1"."Name", "t1"."Description"
from "Blog" as "t1"
limit 2

-- Executing SQL: Parameters: [$1=1, $2='My First Post', $3='Hello, world!', $4=0]
insert into "Post" ("BlogId", "Title", "Content", "Published") values (?, ?, ?, ?) returning "Id"

