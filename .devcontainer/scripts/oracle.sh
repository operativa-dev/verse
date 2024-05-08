/opt/homebrew/opt/colima/bin/colima start --arch x86_64 --memory 4

docker run -d -p 1521:1521 -e ORACLE_PASSWORD=Password1 -v .:/scripts gvenzl/oracle-xe
docker exec -it zealous_jang sqlplus system/Password1@localhost
