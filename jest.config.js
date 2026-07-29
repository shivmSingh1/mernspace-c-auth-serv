// import { createDefaultPreset } from "ts-jest";

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} */
// export default {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
//   verbose: true //show tree like structure in output
// };

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
};