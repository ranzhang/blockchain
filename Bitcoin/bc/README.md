
## A Simple Implementation of Blockchain with Python  
** By Randy Zhang **    
  
This is a simple implementation to demonstrate some of the basic fundamental components of a blockchain. Key sections of the code are:
1. A Block class that computes block header and double SHA256 header hash
2. A Blockchain class that can generate the genesis block and additional blocks with a simple Proof of Work algorithm. Though the difficulty and hash target values are set in a way to quickly mine a block, the basic concept is the same as it is used in Bitcoin. 


```python
import hashlib, time
class Block:
    def __init__(self, index, nonce, previous_hash, transactions):
        self.index = index
        self.nonce = nonce
        self.previous_hash = previous_hash
        self.transactions = transactions
        self.timestamp = time.time()
        self.hash = self.get_hash()
    
    def get_hash(self):
        header_bin = (str(self.previous_hash) + 
                      str(self.nonce) + 
                      str(self.timestamp) +
                      str(self.transactions)).encode()
        inner_hash = hashlib.sha256(header_bin).hexdigest().encode()
        outer_hash = hashlib.sha256(inner_hash).hexdigest()
        return outer_hash
```


```python
tx = {
    'sender':"0",
    'recipient':"address_1",
    'amount':1,
}
block0 = Block(0, 0, 0, tx)
block0_hash = block0.hash

blockchain = [block0]
print blockchain[0].hash
```

    7def07fe97522e4184f4bd3c337c25364871c5f8446aa8e42ab703585abca266
    


```python
block1 = Block(1, 0, block0_hash, tx)
blockchain.append(block1)
print blockchain[1].hash
```

    4b1584febd1580082c3af06eae7f18f41735347fb670d458e35251c4780b16fc
    


```python
class Blockchain(object):
    
    def __init__(self):
        self.chain = []
        self.create_genesis_block()
    
    def create_genesis_block(self):
        transactions = {'sender':"genesis", 'recipient':"address_1", 'amount':1,}
        block = self.create_new_block(nonce=0, previous_hash=0, transactions=transactions)
        self.chain.append(block)

    def mine(self, previous_hash, transactions):
        ##pow to find nonce
        MAX_TARGET = int("00FFFFFFFFFF0000000000000000000000000000000000000000000000000000", 16)  
        difficulty = 1
        target = int(MAX_TARGET / difficulty)
        target32 = '{:0>64x}'.format(target) 
        MAX_NOUNCE = 2**32
        nonce = 0
        while nonce <= MAX_NOUNCE:
            block = self.create_new_block(nonce, previous_hash, transactions)
            if block.hash < target32:
                self.chain.append(block)
                return block
            nonce += 1
        return None
        
    def create_new_block(self, nonce, previous_hash, transactions):
        
        block = Block(
            index=len(self.chain),
            nonce=nonce,
            previous_hash=previous_hash,
            transactions=transactions
        )
                
        return block
    
    @property
    def get_last_block(self):
        return self.chain[-1]
    
    def get_block(self, index):
        return self.chain[index]
    
    def get_blockchain_height(self):
        return len(self.chain)
```


```python
blockchain = Blockchain()
print "block.index", "block.nonce", "block.hash"
print blockchain.chain[0].index, blockchain.chain[0].nonce, blockchain.chain[0].hash
for i in range(1, 5):
    tx = {
    'sender':"0",
    'recipient':"address_" + str(i), 
    'amount':1,
    }

    last_hash = blockchain.get_last_block.get_hash()
    block = blockchain.mine(last_hash, tx)
    print block.index, block.nonce, block.hash
    
print "blockchain height: ", blockchain.get_blockchain_height()   
```

    block.index block.nonce block.hash
    0 0 58fde456bbd951c28533d34dc97d8dd78d48bd69e9129ef4107fb005843e2103
    1 196 00cf29a4406802e92b72ff67b4a7d8bba5f04657c414e15d2a4e85aafd3da41b
    2 31 00b4ac450f5cefd5a91491574237d80d32eddb8359ef349a5560f21d9b807201
    3 85 0093b1c3bff3f5ea52881ad3cc2611c3b2879db0b13b34813cf001696822a3ce
    4 576 00eb53a2bcbf0312b251b7f7ee7e409cf8342dadad1665723313463427006133
    blockchain height:  5
    
