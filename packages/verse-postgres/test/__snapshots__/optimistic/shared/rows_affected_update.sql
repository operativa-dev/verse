-- Executing SQL: Parameters: [$1='Non-existent customer', $2=2, $3=2, $4=1]
update "Customer" set "Name" = $1, "_version" = $2 where ("Id" = $3) and ("_version" = $4)

