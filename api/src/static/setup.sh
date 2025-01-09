#!/bin/bash

wget -c https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_16.ptau -O 28_16.ptau

snarkjs groth16 setup datahash.r1cs 28_16.ptau circuit_0000.zkey

snarkjs zkey contribute circuit_0000.zkey datahash_0001.zkey --name="1st Contributor Name" -v

snarkjs zkey beacon datahash_0001.zkey datahash_final.zkey 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"

snarkjs zkey verify datahash.r1cs 28_16.ptau datahash_final.zkey 

snarkjs zkey export verificationkey datahash_final.zkey  vk.json

# rm 28_16.ptau circuit_0000.zkey datahash_0001.zkey