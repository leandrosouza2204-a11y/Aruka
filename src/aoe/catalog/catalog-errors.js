export class AOEReleaseDiscoveryError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "AOEReleaseDiscoveryError";
    this.details = details;
  }
}

export class AOEManifestParseError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "AOEManifestParseError";
    this.details = details;
  }
}

export class AOEChecksumMismatchError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "AOEChecksumMismatchError";
    this.details = details;
  }
}

export class AOEModelMetadataError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "AOEModelMetadataError";
    this.details = details;
  }
}

export class AOECatalogNormalizationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "AOECatalogNormalizationError";
    this.details = details;
  }
}

export class AOECatalogIntegrityError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "AOECatalogIntegrityError";
    this.details = details;
  }
}
