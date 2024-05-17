import { UTApi } from "uploadthing/server";
import type { FileEsque } from "uploadthing/types";
import { env } from "~/env";
import { fileHelper } from "~/lib/utils";
import LocalFileService from "./localFileService";

const modes = {
  local: "local",
  remote: "remote",
} as const;

const mode =
  env.UPLOADTHING_SECRET && env.UPLOADTHING_APP_ID ? modes.remote : modes.local;
const utapi =
  env.UPLOADTHING_SECRET && env.UPLOADTHING_APP_ID
    ? new UTApi({
        apiKey: env.UPLOADTHING_SECRET,
        defaultKeyType: "customId",
      })
    : null;

const localPath = "/local/things";
const remotePath = `https://utfs.io/a/${env.UPLOADTHING_APP_ID}`;

export class ImageService {
  static mode = mode;
  static baseUrl = this.mode === modes.local ? localPath : remotePath;
  static scope = "things";

  static async createFromBase64(base64: string, id: string): Promise<string> {
    try {
      if (this.mode === modes.local) {
        return LocalFileService.createFromBase64(base64, this.scope, id);
      }
      if (utapi) {
        const file = fileHelper.fromBase64(base64, id) as FileEsque;
        file.customId = id;
        return utapi.uploadFiles(file).then(() => `${this.baseUrl}/${id}`);
      }
      throw new Error("Couldn't create image");
    } catch (err) {
      console.log({ err });
      return "";
    }
  }

  static async deleteImage(id: string): Promise<{ success: boolean }> {
    if (this.mode === modes.local) {
      try {
        await LocalFileService.delete(this.scope, id);
        return { success: true };
      } catch (err) {
        return { success: false };
      }
    }

    return !!utapi ? utapi.deleteFiles(id) : { success: false };
  }

  static getUrls(ids: string[]) {
    const urlsMap = new Map<string, string>();
    ids.forEach((id) => urlsMap.set(id, `${this.baseUrl}/${id}`));
    return urlsMap;
  }

  static getUrl(id: string) {
    return `${this.baseUrl}/${id}`;
  }
}
