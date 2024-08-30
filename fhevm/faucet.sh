#!/bin/bash

for i in {1..100}
do
   docker exec -i fhevm faucet 0x9109619746b7117B22242210200f7aACe8647c39
   sleep 3
done
