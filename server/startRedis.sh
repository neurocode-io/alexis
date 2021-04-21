docker image pull redislabs/redismod

docker run \
  -p 6379:6379 \
  -v `pwd`/redis:/data \
  redislabs/redismod \
  --loadmodule /usr/lib/redis/modules/redisearch.so \
  --dir /data