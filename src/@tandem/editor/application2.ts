import "reflect-metadata";
import { createSyntheticBrowserWorkerDependencies } from "@tandem/synthetic-browser";
import { Application, ApplicationServiceDependency, isMaster } from "@tandem/common";
import { 
  FileEditor,
  IFileSystem,
  RemoteFileSystem,
  BundlerDependency,
  RemoteFileResolver,
  FileCacheDependency,
  FileSystemDependency,
  FileEditorDependency,
  FileResolverDependency,
  createSandboxDependencies,
} from "@tandem/sandbox";

// components
import { rootComponentDependency } from "./components/root";
import { layersPaneComponentDepency } from "./components/panes/layers";

// commponent tools
import { gridToolComponentDependency } from "./components/stage-tools/grid";
import { insertToolComponentDependency } from "./components/stage-tools/insert";
import { dragSelectComponentDependency } from "./components/stage-tools/drag-select";
import { selectorToolComponentDependency } from "./components/stage-tools/selector";
import { selectableToolComponentDependency } from "./components/stage-tools/selectable";

// services
import { workspaceDependency } from "./services/workspace";
import { editorServiceDependency } from "./services/editor";
import { backEndServiceDependency } from "./services/back-end";
import { selectorServiceDependency } from "./services/selector";
import { receiverServiceDependency } from "./services/receiver";
import { settingsServiceDependency } from "./services/settings";
import { clipboardServiceDependency } from "./services/clipboard";
import { keyBindingsServiceDependency } from "./services/key-binding";
import { rootComponentRendererDependency } from "./services/root-component-renderer";

// tools
import { pointerToolDependency } from "./models/pointer-tool";

// key bindings
import { keyBindingsDependency } from "./key-bindings";

// extensions
import { htmlExtensionDependencies } from "@tandem/html-extension";
import { sassExtensionDependencies  } from "@tandem/sass-extension";
import { tdprojectExtensionDependencies } from "@tandem/tdproject-extension";

import { Workspace } from "./models";
import { Metadata } from "@tandem/common/metadata";

export class FrontEndApplication extends Application {

  // TODO - change this to something else - maybe workspace
  public workspace: Workspace;
  public settings: Metadata;
  public metadata: Metadata;

  constructor(config?: any) {
    super(config);
    this.metadata = new Metadata();
    this.metadata.observe(this.bus);
  }

  protected registerDependencies() {
    super.registerDependencies();

    // this is primarily for testing
    if (this.config.registerFrontEndDependencies === false) return;

    const masterDependencies = [];
    const workerDependencies = [];

    // TODO - check if nodejs
    if (isMaster) {
      masterDependencies.push(

        // components
        rootComponentDependency,
        layersPaneComponentDepency,

        // tools
        pointerToolDependency,

        // services
        workspaceDependency,

        // dependencies
        keyBindingsDependency,

        // component tools
        gridToolComponentDependency,
        insertToolComponentDependency,
        dragSelectComponentDependency,
        selectorToolComponentDependency,
        selectableToolComponentDependency,

        clipboardServiceDependency,
        keyBindingsServiceDependency,
        rootComponentRendererDependency,
      );
    } else {
      workerDependencies.push(
        createSyntheticBrowserWorkerDependencies()
      );
    }

    this.dependencies.register(

      ...masterDependencies,
      ...workerDependencies,

      editorServiceDependency,
      backEndServiceDependency,
      selectorServiceDependency,
      settingsServiceDependency,
      receiverServiceDependency,

      // extensions
      sassExtensionDependencies,
      htmlExtensionDependencies,
      historyExtensionDependencies,
      tdprojectExtensionDependencies,

      // singletons
      ...createSandboxDependencies(
        this.config.fileSystem || new RemoteFileSystem(this.bus),
        this.config.fileResolver || new RemoteFileResolver(this.bus)
      )
    );
  }
}