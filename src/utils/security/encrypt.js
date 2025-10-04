import CryptoJS from "crypto-js"
export const encrypt=({plaintext="",signature=process.env.ENC_SIGN})=>{
    const encryption=CryptoJS.AES.encrypt(plaintext,signature).toString()
    return encryption
}
export const decrypt=({ciphertext="",signature=process.env.ENC_SIGN})=>{
    const decryption=CryptoJS.AES.decrypt(ciphertext,signature).toString(CryptoJS.enc.Utf8)
    return decryption
}