/**
 * Validates source data against a data class instance.
 * Logs warnings for unknown properties and type mismatches.
 * 
 * @param {Object} srcData - The loaded source data
 * @param {Object} dataRef - An instance of the data class (e.g., new ImsSpinnerData())
 * @param {string} widgetName - Widget tag name for error messages
 * @returns {string[]} Array of warning messages (empty if valid)
 */
export function validateConfig(srcData, dataRef, widgetName) {
  /** @type {string[]} */
  let warnings = [];

  for (let key in srcData) {
    if (key === 'srcList') continue;
    if (!dataRef.hasOwnProperty(key)) {
      warnings.push(`Unknown property "${key}" in <${widgetName}> config`);
      continue;
    }
    let expected = dataRef[key];
    let actual = srcData[key];
    if (expected !== null && expected !== undefined && actual !== null && actual !== undefined) {
      let expectedType = Array.isArray(expected) ? 'array' : typeof expected;
      let actualType = Array.isArray(actual) ? 'array' : typeof actual;
      if (expectedType !== actualType) {
        warnings.push(`Type mismatch for "${key}" in <${widgetName}>: expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  if (warnings.length) {
    warnings.forEach((w) => console.warn(`[IMS] ${w}`));
  }
  return warnings;
}
