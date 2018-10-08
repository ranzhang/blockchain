
## Crytographical Keys and Digital Signature 
**By Randy Zhang 

There are two key concepts of cryptography that need to be biefly introduced: 
1. Encryption: With public key cryptography, a sender can ensure that only the intended receiver can open (ie read) the message by encrypting the message using the receiver's public key. The receiver can read the encrypted message with his/her private key. Because only the receiver owns the private key, thus only the receiver can read the message. More on privae and public keys later. This is to ensure the content of the message is hidden for public view.
2. Digital Signature: For a receiver to ensure the message truly originates from the sender and the integrity of the message, the receiver can verify the message's digital signature. Sender uses its private key and hash the message and the result is the digital signature. Receiver can perform the singature verification using sender's public key.

Private and public keys are mathmatically linked in a one-way hash, that is, a private key can generate a public key but it is extremely computationally difficult to find the private key from a public key. 

The Python module used here is the ECDSA (Elliptic Curve Digital Signature Algorithm) module, which is a handy library (https://github.com/warner/python-ecdsa) for Python blockchain use.


```python
from ecdsa import SigningKey, SECP256k1
```


```python
##generate key pairs
##SECP256k1 is the Bitcoin elliptic curve
private_key = SigningKey.generate(curve=SECP256k1)
public_key = private_key.get_verifying_key()
```


```python
public_key.to_string().hex()
```




    '1cb8a937e104f8e24fa7693452f3e447f95d02c8652e0e6829b00c9593593453072bf1d928224566be06ec15cc1c4d610b68c6725425a017a46e2158795c1b39'




```python
##Digitally sign a message
message = b'This is a test message'
signature = private_key.sign(message)
signature.hex()
```




    '77da4141b2715f8db982d6e0a96ba382a476f027ee65624276d53b36c7167e1c6b49d7633a7ce0c7a3b6de59a8fc9c029271f04e77cff77b72244d298e80b7bc'




```python
##verify a message's digital signature with sender's public key
public_key.verify(signature, message)
```




    True




```python
message1 = b'This is a test message.'
try:
    public_key.verify(signature, message1)
except:
    print('Signature verification failed')
```

    Signature verification failed
    


```python

```
