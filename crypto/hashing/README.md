
## Crypto Hashing and Merkle Tree
**Randy Zhang**

Hashing is to take a typically long list and condenses it to a short list. The short list (hash) is used to represent the long list (input). Hashing is commonly used in programming and database to speed up search. The algorithm to generate the hash is called the hash function.

A hashing algorithm is a mathematical function that condenses data to a fixed size. Here we are interested in only the cryptographic hashing. Hash is, called message digest in cryptography, used as a finger print for some input data. If there is any change to the data, the hash will be different. By computing the hash, you will be able to determine if the data have changed in any way. Hash is used in blockchain to represent data integrity of blocks.

Properties of hash function:
- 1 Deterministic: identical input generates the same hash each time, 
- 2 Uniqueness: any change to the input always generates a different hash that is quite different (unpredictable). To put it in another way, two different data cannot generate the same hash
- 3 Irreversible: hash is generated one way direction, ie from the hash you cannot derive the original string
- 4 Constant output size: regardless of the size of the original data, it will always generate the same length hash for the same algorithm
- 5 Public: the algorithm is public, there is no secret or private keys

Examples of hash algorithms used in cryptography:
- 1 Message Digest version 5 (MD5): output (called digest) = 128 bit, considered unsecure now
- 2 Secure Hash Algorithm (SHA) version 1 (SHA1): 160 bit, not recommended any more
- 3 SHA2: two types, SHA256 (256 bit digest) and SHA512 (512 bit digest)
- 4 SHA3: recommended

### Hashing Basics


```python
import hashlib          ##use this lib to generate hash
```


```python
text = b'Hello World'                    ##'b is ignored in Python 2.
m = hashlib.sha256()                     ##there are other hashing algorithms
m.update(text)                           ##multiple update() = concatenate of the text into a single update call
#m.digest()                              ##get the digest
m.hexdigest()                            ##generates digest in hex digits
```




    'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'




```python
#to reset the digest call, need to call sha256 algo again, and do not use update()
hashlib.sha256(text).hexdigest()         ##notice the digest is indentical as before
```




    'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'




```python
##change the text to text1 with a minor change, hash is quite different
text1 = b'Hello World!'
hashlib.sha256(text1).hexdigest()
```




    '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'




```python
#Note: if using update(), it will aggregate all inputs, so the input is actually text+text 
m.update(text)                           ##multiple update() = concatenate of the text into a single update call
m.hexdigest()  
```




    '60b3aaa7a9c94c59ff828b651205b1c5409eaf492505cd4a0a45133013b5a028'




```python
##same digest as calling the hash function with text+text
hashlib.sha256(text+text).hexdigest() 
```




    '60b3aaa7a9c94c59ff828b651205b1c5409eaf492505cd4a0a45133013b5a028'




```python
##double hashing is much more secure and is used in Bitcoin
def doubleSha256(input):
    return hashlib.sha256(hashlib.sha256(input).hexdigest()).hexdigest() 
doubleSha256(text)
```




    'da0dec1c790d6b6197d906cce98981d60a4dd8c8da430fc71961bafaf2a8891a'



### Finding Merkel Root
Merkel tree is a binary tree of hashes. All the hashes are recursively hashed (doubleshashed in this example) until a single 
Merkle root is generated. This single hash can be used as the finger print for the entire tree without storing the tree. Merkle 
root is used in Bitcoin to represent all the transactions in the block.


```python
transactions = ['a', 'b', 'c', 'd', 'e']
leafHash = []
class Merkleroot(object):
    def __init__(self):
        pass
    
    def doubleSha256(input):
        return hashlib.sha256(hashlib.sha256(input).hexdigest()).hexdigest() 
    
    def findMerkleRoot(self, leafHash):
        hash = []
        hash2 = []
        if len(leafHash) % 2 != 0:                             ##if not even, repeat the last element
            leafHash.extend(leafHash[-1:])
        
        for leaf in sorted(leafHash):                         ##for each leaf
            hash.append(leaf)
            if len(hash) % 2 == 0:                            ##only add secondary hash if there are two first hash
                hash2.append(doubleSha256(hash[0]+hash[1]))   ##run through hash func for both hashes
                hash == []                                    ##reset first hash to empty
        if len(hash2) == 1:                                   ##if secondary hash is only one, we are the root
            return hash2
        else:
            return self.findMerkleRoot(hash2)                 ##if not, recurse with hash2

##compute a list of hashes from transactions
for trans in transactions:
   leafHash.append(doubleSha256(trans))

mr = Merkleroot()
mr.findMerkleRoot(leafHash)

            
        
```




    ['a2fbe3e7b1ea35e98c99caf52a55dea837670ca998dbbb52a09c4e2ec511c933']
