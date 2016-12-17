import * as path from "path";
import { BaseStudioMasterCommand } from "./base";
import { MimeTypeProvider, inject, removeURIProtocol } from "@tandem/common";
import { TDPROJECT_MIME_TYPE, TD_PRIMARY_FILE_EXTENSION } from "@tandem/tdproject-extension/constants";
import { CreateTemporaryWorkspaceRequest } from "tandem-code/common";
import { FileCacheProvider, FileCache, URIProtocolProvider } from "@tandem/sandbox"; 

let i = 0;

export class CreateTempWorkspaceCommand extends BaseStudioMasterCommand {

  @inject(FileCacheProvider.ID)
  private _fileCache: FileCache;
  
  async execute({ uri }: CreateTemporaryWorkspaceRequest) {

    // temp name must share the same path as the file to ensure that all relative assets
    // are loaded in.
    const tmpName = `cache://` + path.join(uri && path.dirname(removeURIProtocol(uri)) || "/", `unsaved${i++}.${TD_PRIMARY_FILE_EXTENSION}`);

    let content;
    let type;

    if (uri && MimeTypeProvider.lookup(uri, this.injector) === TDPROJECT_MIME_TYPE) {
      const result = await URIProtocolProvider.lookup(uri, this.injector).read(uri);
      content = result.content;
      type    = result.type;
    } else {
      content = uri ? `<tandem>
        <remote-browser src="${uri}" />
      </tandem>` : `<tandem><remote-browser /></tandem>`;
    }


    await this._fileCache.save(tmpName, { type, content });
    
    return tmpName;
  }
} 