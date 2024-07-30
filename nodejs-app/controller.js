import logger from "./logger.js";
// import * as stackTraceParser from "stacktrace-parser";
import { SourceMapConsumer } from "source-map";
// import * as https from "https";
// import * as http from "http";
import crypto from "crypto";
const algorithm = "aes-256-cbc";
const key = "12345678901234567890123456789012";

const decrypt = (text) => {
  console.log("test--", text);
  const iv = Buffer.from(text.iv, "hex");
  const encryptedText = Buffer.from(text.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const homeController = (req, res) => {
  try {
    logger.info("welcome home page");
    res.send("welcome Home Page");
  } catch (error) {
    console.log(error);
  }
};

const postController = (req, res) => {
  try {
    logger.info("welcome Post page");
    res.send("Welcome Post page");
  } catch (error) {
    console.log(error);
  }
};

const logErrorController = async (req, res) => {
  try {
    const { payload } = req.body;
    // const parsedStack = stackTraceParser.parse(stack);
    // const frame = parsedStack[0];
    // // Define a function to get the source map from a URL
    // const getSourceMap = (url) => {
    //   return new Promise((resolve, reject) => {
    //     const get = url.startsWith("https") ? https.get : http.get;

    //     get(url, (response) => {
    //       let data = "";
    //       response.on("data", (chunk) => (data += chunk));
    //       response.on("end", () => resolve(data));
    //     }).on(
    //       "error",
    //       (e) => {
    //         console.error(`error from getSourceMap ${e} and url->${url}`);
    //       },
    //       reject
    //     );
    //   });
    // };
    // Load the source map
    // const rawSourceMap = await getSourceMap(`${frame.file}.map`);
    const { stack, frame, errorInfo } = JSON.parse(decrypt(payload));
    const sourceMap = await new SourceMapConsumer(stack.toString());

    // Get the original position and file name
    const originalPosition = sourceMap.originalPositionFor({
      line: frame.lineNumber,
      column: frame.column,
    });

    const mappedStack = {
      fileName: originalPosition.source,
      lineNumber: originalPosition.line,
      columnNumber: originalPosition.column,
    };
    logger.error(
      `ErrorLogger | Error details: ${JSON.stringify(
        mappedStack
      )} and the Error message: ${errorInfo}`
    );
    console.log("requestframe--", frame);
    res.send("Error Reported Successfully");
  } catch (error) {
    console.log(error);
  }
};

const controllers = { homeController, postController, logErrorController };

export default controllers;
