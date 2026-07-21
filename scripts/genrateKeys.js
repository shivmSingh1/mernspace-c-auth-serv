import crypto from "crypto";
import fs from "fs";

const { privatekey, publicKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: 'pkcs1',
		format: 'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs1',
		format: "pem"
	}
})

console.log('privateKye', privatekey)
console.log('publickey', publicKey)

fs.writeFileSync('/certs/privateKey.pem', privatekey)
fs.writeFileSync('/certs/publicKey.pem', publicKey)