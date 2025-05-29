import type { KarmaConfig, ProjectFileNames } from "./karma-types.ts";

// DO NOT CHANGE exported variable name
export const projectFileNames: ProjectFileNames = {
  systemGenerated: {
    dsStoreDir: ".DS_Store",
  },
  static: {
    sourceDir: "dev",
    karmaTypesFile: "karma-types.ts",
    licenceFile: "LICENCE",
    readMeFile: "README.md",
  },
  generated: {
    stagingDir: "stage",
    bunLockFile: "bun.lock",
    bunLockBFile: "bun.lockb",
    gitIgnoreFile: ".gitignore",
    dotVscodeDir: ".vscode",
    nodeModulesDir: "node_modules",
    packageJsonFile: "package.json",
  },
  built: {
    publishDir: "docs",
    pageFile: "page.ts",
    manifestFile: "manifest.ts",
  },
};

// DO NOT CHANGE exported variable name
export const config: KarmaConfig = {
  brahma: {
    build: {
      stagingDirName: projectFileNames.generated.stagingDir,
      publishDirName: projectFileNames.built.publishDir,
      buildablePageFileName: projectFileNames.built.pageFile,
      buildableManifestFileName: projectFileNames.built.manifestFile,
      ignoreDelimiter: "@",
      skipErrorAndBuildNext: true,
    },
    localServer: {
      port: 3000,
      redirectOnStart: false,
      reloadPageOnFocus: false,
      otherWatchDirs: [],
      serveDirectory: `${projectFileNames.generated.stagingDir}`,
    },
  },
  maya: {
    mode: "pwa",
    sourceDirName: projectFileNames.static.sourceDir,
    packageJson: {
      dependencies: {
        "@mufw/maya": "0.1.23",
        "@cyftech/immutjs": "0.1.0",
        "@cyftech/signal": "0.1.8",
        "@types/web-app-manifest": "1.0.8",
      },
    },
  },
  vscode: {
    settings: {
      "deno.enable": false,
      "files.exclude": {
        [projectFileNames.static.karmaTypesFile]: true,
        [projectFileNames.static.licenceFile]: true,
        [projectFileNames.static.readMeFile]: true,
        [projectFileNames.generated.stagingDir]: false,
        [projectFileNames.generated.bunLockFile]: true,
        [projectFileNames.generated.bunLockBFile]: true,
        [projectFileNames.generated.gitIgnoreFile]: true,
        [projectFileNames.generated.dotVscodeDir]: true,
        [projectFileNames.generated.nodeModulesDir]: true,
        [projectFileNames.generated.packageJsonFile]: true,
        [projectFileNames.built.publishDir]: false,
      },
    },
  },
  git: {
    ignore: [
      projectFileNames.systemGenerated.dsStoreDir,
      projectFileNames.static.karmaTypesFile,
      projectFileNames.generated.bunLockFile,
      projectFileNames.generated.bunLockBFile,
      projectFileNames.generated.dotVscodeDir,
      projectFileNames.generated.nodeModulesDir,
      projectFileNames.generated.packageJsonFile,
      `/${projectFileNames.generated.stagingDir}`,
    ],
  },
};
