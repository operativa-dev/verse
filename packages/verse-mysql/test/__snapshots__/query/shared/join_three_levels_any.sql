-- Executing SQL: Parameters: []
select exists (
   select `t7`.`TrackId`, `t7`.`Name`, `t7`.`AlbumId`, `t7`.`GenreId`, `t7`.`Composer`, `t7`.`c0`, `t7`.`Title`, `t7`.`ArtistId`, `t7`.`c1`, `t7`.`c2`
   from (
      select `t4`.`TrackId`, `t4`.`Name`, `t4`.`AlbumId`, `t4`.`GenreId`, `t4`.`Composer`, `t4`.`c0`, `t4`.`Title`, `t4`.`ArtistId`, `t5`.`ArtistId` as `c1`, `t5`.`Name` as `c2`
      from (
         select `t1`.`TrackId`, `t1`.`Name`, `t1`.`AlbumId`, `t1`.`GenreId`, `t1`.`Composer`, `t2`.`AlbumId` as `c0`, `t2`.`Title`, `t2`.`ArtistId`
         from `Track` as `t1` 
         inner join `Album` as `t2` on `t1`.`AlbumId` = `t2`.`AlbumId`
      ) as `t4` 
      inner join `Artist` as `t5` on `t4`.`ArtistId` = `t5`.`ArtistId`
   ) as `t7`
   where `t7`.`ArtistId` = 1
)

