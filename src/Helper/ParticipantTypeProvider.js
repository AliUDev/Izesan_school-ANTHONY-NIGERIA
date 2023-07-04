import CryptoJS from "crypto-js";

export const typeProvider = () => {
    if(localStorage.getItem('participant_type')){
        const rawData2 = localStorage.getItem('participant_type');
        const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
        return decryptedData
    }else{
        return null
    }
};


