import CryptoJS from "crypto-js";

export const encryptedData = () => {
  const rawData2 = localStorage.getItem("encrypted_data");
  const decryptedData = CryptoJS.AES.decrypt(rawData2, "001").toString(
    CryptoJS.enc.Utf8
  );
  const parsedData = JSON.parse(decryptedData);
  return parsedData;
};

export const dataProvider = () => {
  if(localStorage.getItem("encrypted_data_ts")){
    const rawData2 = localStorage.getItem("encrypted_data_ts");
    const decryptedData = CryptoJS.AES.decrypt(rawData2, "001").toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    return parsedData;
  }else{
    return null
  }
};
export const class_info = () => {
    if(localStorage.getItem('class_info')){
        const rawData2 = localStorage.getItem('class_info')
        const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
        const parsedData = JSON.parse(decryptedData);
        return parsedData
    }else{
        return null
    }
};
export const teacher_email = () => {
    if(localStorage.getItem('teacher_email')){
        const rawData2 = localStorage.getItem('teacher_email')
        const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
        return decryptedData
    }else{
        return null
    }
};


export const chaptersList = [
  "Greetings & Pleasantries",
  "Questions",
  "Tenses",
  "Negation",
  "Parts of the body",
  "Objects in a home",
  "Compliments",
  "Basic Phrases",
  "Food",
  "Command Statements + Action Statements",
  "Complex Sentences",
  "Adjective & Adjectival Phrases",
  "Prepositions",
  "Animals",
  "Clothing & Accessories",
  "Parts of a building",
  "Occupations",
  "Environment",
  "Time",
  "Numbering",
  "Proverbs/Idioms",
];

export const points = () => {
  let arr = [];
  for (let i = 10; i <= 100; i += 10) {
    arr.push(i);
  }
  return arr;
};
