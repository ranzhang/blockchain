## Bitcoin Hashing
*by Randy Zhang*

Bitcoin records these hash values:
1. Hash: this is the hash generated from the current block header, it is a finger print of the current block, which will be the Previous Block hash in the child block. This hash is computed in the Proof of Work (PoW) by miners. It is not included in the current block’s header but included in the child block’s header. Because the target (or nBits) is part of the header, any node can easily compute the hash and compare it with the target to verify the PoW condition.
2. Previous Block: this is the Hash of the previous block header
3. Merkle Root: this is the hash from all the transactions of the current block

This post documents Python code to generate the hash and the target. A block is only accepted if its hash is less than or equal to the target (PoW condition). Merkle Root hashing code is documented [here](https://github.com/ranzhang/blockchain/tree/master/crypto/hashing).

Answers to some of the common misconception and misinformation:
1. Misconception: Bitcoin Proof of Work (PoW) condition is based on the number of leading zeros. Actually: A block is only accepted if its hash is less than or equal to the target, and not number of leading zeros. In some cases, it may be true that number of leading zeros is a simple representation
2. Misconception: Bitcoin block hash is a hash of the entire block. Actually: It is a hash of the header only.
3. Misconception: Bitcoin block hash is a hash of the block header and the previous block. Actually: It is a hash of the header of the current block.
4. Misconception: Bitcoin Difficulty value is directly used in PoW condition. Actually: Difficulty is used to compute the target, which is used for PoW condition.
5. Misconception: Bitcoin block hash is part of the block. Actually: The block hash is part of the header of its child block and is not directly encoded in the current block.
6. Misconception: Nonce is some magic random number. Actually: It is a well known range that is sequentially incremented during PoW.

### Bitcoin Block Header Hashing
One of the most important computation of the Bitcoin nodes is to compute block header hash. 
Using a real block [125552](https://blockchain.info/block/00000000000000001e8d6829a8a21adc5d38d0a473b144b6765798e61f98bd1d) to demonstrate how to compute block header hash from the 6 header fields. 


```python
import sys
sys.byteorder               ##check endian system of the processor
```




    'little'




```python
from struct import pack, unpack, unpack_from
##packing: converting interger 1 to little endian, then convert to hex string
version = pack('<I', 1).encode('hex_codec')                   ##format string: < little-endia, I unsigned int
version
```




    '01000000'




```python
##for long number such as 256-bit, struct will not work
##convert to byte sequence first
prev_block = '00000000000008a3a41b85b8b29ad444def299fee21793cd8b9e567eab02cd81'.decode('hex')
##reverse the byte order, then convert back to hex string
prev_block = prev_block[::-1].encode('hex_codec') 
prev_block
```




    '81cd02ab7e569e8bcd9317e2fe99f2de44d49ab2b8851ba4a308000000000000'




```python
##using unhexlify for the same result
from binascii import unhexlify
prev_block = unhexlify('00000000000008a3a41b85b8b29ad444def299fee21793cd8b9e567eab02cd81')
prev_block[::-1].encode('hex_codec') 
```




    '81cd02ab7e569e8bcd9317e2fe99f2de44d49ab2b8851ba4a308000000000000'




```python
merkle_root = unhexlify('2b12fcf1b09288fcaff797d71e950e71ae42b91e8bdb2304758dfcffc2b620e3')
merkle_root = merkle_root[::-1].encode('hex_codec') 
merkle_root
```




    'e320b6c2fffc8d750423db8b1eb942ae710e951ed797f7affc8892b0f1fc122b'




```python
##timestamp, use calendar.timegm() 
import datetime, calendar
btimestamp = '2011-05-21 17:26:31'                   ##this is GMT, not local time
b_epoc = calendar.timegm(datetime.datetime.strptime(btimestamp, "%Y-%m-%d %H:%M:%S").timetuple())
timestamp = pack('<I', b_epoc).encode('hex_codec') 
timestamp
```




    'c7f5d74d'




```python
##target bits
bits = pack('<I', 440711666).encode('hex_codec') 
bits 
```




    'f2b9441a'




```python
##nonce
nonce = pack('<I', 2504433986).encode('hex_codec') 
nonce 
```




    '42a14695'




```python
import hashlib

##concatenate all the hex digits into one string
headerHex = (version + prev_block + merkle_root + timestamp + bits + nonce)
headerByte = headerHex.decode('hex')                ##convert hex digits into a sequence of bytes
##run through the double SHA256 hashing
hash = hashlib.sha256(hashlib.sha256(headerByte).digest()).digest()
hash.encode('hex_codec')                            ##aggregate a sequence of bytes into a hex string
hash = hash[::-1].encode('hex_codec')               ##reverse the order in hex
hash
```




    '00000000000000001e8d6829a8a21adc5d38d0a473b144b6765798e61f98bd1d'



### Bitcoin Target Computation
Bitcoin specifies a target or target threshold for which every valid block in that group must compare with. A block is only accepted if its header hash is less than or equal to the target threshold. This target is adjusted by the network based on the block's difficulty. Bitcoin reports both difficulty and target. The target is part of the header and is an encoded value called nBits. The data are coming from Block [125552](https://blockchain.info/block/00000000000000001e8d6829a8a21adc5d38d0a473b144b6765798e61f98bd1d) 


```python
##max Bitcoin target threshold
MAX_TARGET = int("00000000FFFF0000000000000000000000000000000000000000000000000000", 16)            ## Hex, Base16
Difficulty = 244112.49                           ##from Block 125552
target = int(MAX_TARGET / Difficulty)
target32 = '{:0>64x}'.format(target)             ##convert to 32 byte hex notation; nBits = 1a44b9f2 or 440711666 
print target32, hash < target32
```

    00000000000044b9f1f57cc23800000000000000000000000000000000000000 True
