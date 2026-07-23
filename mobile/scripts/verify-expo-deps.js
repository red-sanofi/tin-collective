#!/usr/bin/env node
/**
 * Fail fast when Expo config plugin deps are missing (common after partial npm install).
 */
const { existsSync } = require("fs");
const { join } = require("path");

const root = join(__dirname, "..");
const required = [
  "expo/package.json",
  "expo-router/package.json",
  "@expo/config-plugins/package.json",
  "babel-preset-expo/package.json",
  "react-native-gesture-handler/package.json",
  "react-native-reanimated/package.json",
  "react-native-worklets/package.json",
];

const missing = required.filter((rel) => !existsSync(join(root, "node_modules", rel)));

if (missing.length > 0) {
  console.error("\n[mobile] Missing Expo dependencies:");
  missing.forEach((item) => console.error(`  - ${item}`));
  console.error("\nRun: rm -rf node_modules package-lock.json && npm install\n");
  process.exit(1);
}
