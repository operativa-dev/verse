-- Executing SQL: Parameters: []
select not (exists (
   select `t1`.`AlbumId`, `t1`.`Title`, `t1`.`ArtistId`
   from `Album` as `t1`
   where not (`t1`.`AlbumId` > 0)
))

