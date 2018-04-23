
## How to Compute Bitcoin Addresses with Python
**By Randy Zhang

The purpose of Bitcoin blockchain is to process and document bitcoin transactions. Each transaction records bitcoin value in the form of satoshi's between a payer and one or more payees. Bitcoin address is used to receive bitcoins but it is not directly provided in a Bitcoin block. The address can be computed from the information provided in the blocks. 
There are several payment methods supported by Bitcoin:
- P2PKH (Pay to Public Key Hash): This is the most common method in Bitcoin v1. Payer provides signature and public key (not key hash). The network performs the validation. The public key is not shown in the transaction until it is spent.
- P2SH (Pay to Script Hash): Payer does not provide public key, just a script. 
- P2WPKH (Pay To Witness Public Key Hash): same as P2PKH except now the key hash (witness data) is stored at the witness section. This is part of the enhancement by SegWit (Segregated Witness).
- P2WSH: same as P2SH except the script is now stored at the witness section. This is part of the enhancement by SegWit (Segregated Witness).

This post will document how to compute the two most common Bitcoin addresses from a given public key and key hash. How to do public key compression is included as well.

### From Public Key to P2PKH Address
P2PKH address is a 25-byte entity encoded in Base58. A sample Bitcoin address looks like this: 1FwLde9A8xyiboJkmjpBnVUYi1DTbXi8yf. These are the steps to compute the address using a public key:
1. Compute the key hash: first take the public key through SHA256 hashing, then run it through RIPEMD-160 hashing
2. Compute the checksum: concatenate the protocol version and the key hash and take the result through the double SHA256 hashing, then extract the first 4 octets as the checksum
3. Compute the final value by concatenating the protocol version, key hash, and the checksum
4. Convert the final value to Base58 value


```python
import binascii, hashlib, base58

def puk2Baddr(puk, ver):
    keyhash = binascii.hexlify(hashlib.new("ripemd", hashlib.sha256(binascii.unhexlify(puk)).digest()).digest()) 
    ext = ver + keyhash
    cs = binascii.hexlify(hashlib.sha256(hashlib.sha256(binascii.unhexlify(ext)).digest()).digest())
    checksum = cs[:8]
    final = ext + checksum
    return base58.b58encode(final.decode('hex'))

puk="0450863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B23522CD470243453A299FA9E77237716103ABC11A1DF38855ED6F2EE187E9C582BA6"
ver = '00'
puk2Baddr(puk, ver)
```




    '16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM'



### From Key Hash to P2PKH Address
In a Bitcoin transaction Output section, key hash is provided as the recipient instead of a public address. This is by design as the bitcoin is not yet spent. Once a bitcoin is spent, its public address is provided in the Input section of a transaction. The Bitcoin address can be computed from the key hash. Key hash is a 20 byte entity.


```python
def keyhash2Baddr(keyhash, ver):
    ext = ver + keyhash
    cs = binascii.hexlify(hashlib.sha256(hashlib.sha256(binascii.unhexlify(ext)).digest()).digest())
    checksum = cs[:8]
    final = ext + checksum
    return base58.b58encode(final.decode('hex'))

keyhash = "a3d89c53bb956f08917b44d113c6b2bcbe0c29b7"
ver = '00'
keyhash2Baddr(keyhash, ver)
```




    '1FwLde9A8xyiboJkmjpBnVUYi1DTbXi8yf'



### From Public Key to P2WPKH Address


```python
import binascii, hashlib, base58

def puk2WPKH(puk, ver):
    wver = '00'
    keyhash = binascii.hexlify(hashlib.new("ripemd", hashlib.sha256(binascii.unhexlify(puk)).digest()).digest()) 
    ext = ver + wver + '00' + keyhash
    cs = binascii.hexlify(hashlib.sha256(hashlib.sha256(binascii.unhexlify(ext)).digest()).digest())
    checksum = cs[:8]
    final = ext + checksum
    return base58.b58encode(final.decode('hex'))
```


```python
puk = '0204b3506d8903ca601c97a4abab6548e91004c535a5a45e21299a494b146859ca'
ver ='06'
puk2WPKH(puk, ver)
```




    'p2xxWKrnHUv4PsNC8U1noMVGKez8qyopFQLk'



### From Key Hash to P2WPKH Address


```python
def keyhash2WPKH(keyhash, ver):
    wver = '00'
    ext = ver + wver + '00' + keyhash
    cs = binascii.hexlify(hashlib.sha256(hashlib.sha256(binascii.unhexlify(ext)).digest()).digest())
    checksum = cs[:8]
    final = ext + checksum
    return base58.b58encode(final.decode('hex'))

keyhash = "2c418ec354a1ab688a656d86b16c02abe8f592e9"
ver = '06'
keyhash2WPKH(keyhash, ver)
```




    'p2xxWKrnHUv4PsNC8U1noMVGKez8qyopFQLk'



### Compressing Public Key
Compress a 65 byte public key to 33 bytes. Compressed public key is used in P2WPKH.


```python
def puk2compress(puk):
    XY = puk[2:]
    X, Y = XY[:len(XY)/2], XY[len(XY)/2:]
    pref = '02' if int(Y[-1]) % 2 == 0 else '03'
    return pref + X
    
puk = '0450863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B23522CD470243453A299FA9E77237716103ABC11A1DF38855ED6F2EE187E9C582BA6'
puk2compress(puk)
```




    '0250863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B2352'



