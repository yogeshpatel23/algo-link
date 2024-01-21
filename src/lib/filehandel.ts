import * as fspromis from "fs/promises";
import fs from "fs";

export async function getFileData(fileName: string) {
  try {
    if (fs.existsSync(`localData/${fileName}`)) {
      return await fspromis.readFile(`localData/${fileName}`, {
        encoding: "utf-8",
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("file read error");
  }
}

export async function saveFile(fileName: string, data: string) {
  try {
    await fspromis.writeFile(`localData/${fileName}`, data);
  } catch (error) {
    console.log(error);
  }
}
