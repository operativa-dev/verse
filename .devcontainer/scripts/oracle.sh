docker run -d -p 1521:1521 -e ORACLE_PASSWORD=Password1 -v .:/scripts gvenzl/oracle-xe
docker exec -it zealous_jang sqlplus system/Password1@localhost
