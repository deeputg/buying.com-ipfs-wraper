# Welcome to Buying.com IPFS REST API
## Install IPFS

If you haven’t done so already, your first step is to  **install IPFS**! Most people prefer to install a prebuilt package, which you can do on the  [IPFS distributions page](https://dist.ipfs.io/#go-ipfs)  by clicking “Install go-ipfs” (our reference implementation written in Go) and then following the instructions for  [installing from a prebuilt package](https://docs.ipfs.io/guides/guides/install/#installing-from-a-prebuilt-package).

[Download IPFS for your platform](https://dist.ipfs.io/#go-ipfs)

after downloading the above file, unzip it
```
cd extracted_directory
sudo ./install.sh
```
## Initialize the repository
`ipfs` stores all its settings and internal data in a directory called the _repository._ Before using IPFS for the first time, you’ll need to initialize the repository with the `ipfs init` command:
```sh
> ipfs init
initializing ipfs node at /Users/jbenet/.go-ipfs 
generating 2048-bit RSA keypair...done 
peer identity: Qmcpo2iLBikrdf1d6QU6vXuNb6P7hwrbNPW9kLAH8eG67z 
to get started, enter: 

ipfs cat /ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme
```

## Bootstrap IPFS nodes
 Remove the default entries of bootstrap nodes from both the bootnode and the client node.
 ```sh
 ipfs bootstrap rm --all
 ```

 You can check the IPFS config using the following command . and make sure the bootsrap parameter is null
 ```sh
 ipfs config show
 ```

 The Peer Identity was created during the initialisation of IPFS and can be found with the following statement.
 ```sh
 ipfs config show | grep "PeerID"
 ```

 Now add bootstrap 
```sh
 ipfs bootstrap add /ip4/<ip address of bootnode>/tcp/4001/ipfs/<peer identity hash of bootnode>
 ```

 Run your statement on both the bootstrap node and the client node.

 Make the network private
 ```sh
 export LIBP2P_FORCE_PNET=1
 ```


## Taking your Node Online
Once you’re ready to join your node to the public network, run the ipfs daemon in `another terminal`
```sh
> ipfs daemon
```


## Running API server
Install all the dependancies using yarn command
```sh
> yarn
```

Start the apiserver
```sh
> yarn start
```

## Branches
To create a new feature or bugfix (or chore) please create a new branch and use a prefix (e.g  feature/my-awesome-new-feature  or  bugfix/something-not-working). The prefixes we use are  bug,  feat,  chore  and  hotfix. Please don't use anything else.