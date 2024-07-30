import * as https from "https";
import * as http from "http";
import * as stackTraceParser from "stacktrace-parser";
import crypto from 'crypto';
const algorithm = 'aes-256-cbc';
const key = '12345678901234567890123456789012';
const iv = crypto.randomBytes(16);

const encrypt=(text:string)=> {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

const getSourceMap = (url:any) => {
      return new Promise((resolve, reject) => {
        const get = url.startsWith("https") ? https.get : http.get;

        get(url, (response:any) => {
          let data = "";
          response.on("data", (chunk:any) => (data += chunk));
          response.on("end", () => resolve(data));
        }).on(
          "error",
          reject
        );
      });
    };
export const errorLoggerApi = async (error:any, errorInfo:any) => {
  const parsedStack = stackTraceParser.parse(error.stack);
  const frame = parsedStack[0];
  const rawSourceMap=await getSourceMap(`${frame.file}.map`);
  const requestBody=JSON.stringify({
      stack: rawSourceMap,
      frame: frame,
      errorInfo:error.toString()
    })
  const encryptedPayload=encrypt(requestBody)
  return fetch('http://localhost:8080/logError', {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payload:encryptedPayload
    }),
  }).then((response) => {
    console.error('response', response);
  });
};