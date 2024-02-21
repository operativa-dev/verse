-- Executing SQL: Parameters: [$1='Customer N']
insert into `Customer` (`Name`) values (?);
select `Cid` from `Customer` where `Cid` = last_insert_id()

-- Executing SQL: Parameters: [$1=-11]
insert into `Order` (`CustomerId`) values (?);
select `Oid` from `Order` where `Oid` = last_insert_id()

