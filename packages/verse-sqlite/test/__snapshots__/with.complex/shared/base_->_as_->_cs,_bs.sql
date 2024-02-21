-- Executing SQL: Parameters: []
select "t3"."BaseId", "t5"."AId", "t5"."BaseId", "t7"."CId", "t7"."AId", "t9"."BId", "t9"."BaseId"
from "Base" as "t3" 
left join "BranchB" as "t9" on "t3"."BaseId" = "t9"."BaseId" 
left join "BranchA" as "t5" on "t3"."BaseId" = "t5"."BaseId" 
left join "LeafC" as "t7" on "t5"."AId" = "t7"."AId"
order by "t3"."BaseId", "t5"."AId"

