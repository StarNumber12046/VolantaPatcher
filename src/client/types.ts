export interface PatchManifest {
  id: string;
  name: string;
  description?: string;
}

export interface PatchModule {
  manifest: PatchManifest;
  execute: (enabled: boolean) => void;
}
