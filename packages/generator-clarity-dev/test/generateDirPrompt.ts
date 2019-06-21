import fs from "fs";
import path from "path";
import assert = require("yeoman-assert");
import yo_env = require("yeoman-environment");
import Generator = require("yeoman-generator");
import helpers = require("yeoman-test");
import utils = require("./util");

describe("generator tests [in non-empty dir]", () => {
  let testingDir: string;
  let generator: Generator;

  before(async () => {
    testingDir = path.join(__dirname, "../.yo-test");
    await new Promise((resolve, reject) => {
      helpers.testDirectory(testingDir, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  it("add existing files to output dir", async () => {
    fs.writeFileSync(path.join(testingDir, "something.txt"), "x");
  });

  it("generate a project", async () => {
    const appPath = path.join(__dirname, "../generators/app");
    generator = helpers.createGenerator("clarity-dev", [appPath], [], {
      skipInstall: false
    });
    helpers.mockPrompt(generator, { project_name: "tmp-example" });
    // Setup local dependencies.
    const moduleClarityCore = path.join(__dirname, "../../clarity");
    const moduleClarityNativeBin = path.join(__dirname, "../../clarity-native-bin");
    generator.npmInstall([moduleClarityCore, moduleClarityNativeBin]);

    // Run yo-generator to output project.
    await Promise.resolve(generator.run());

    // Validate output directory.
    const outputDir = generator.destinationRoot();
    assert.strictEqual(path.basename(outputDir), "tmp-example");
  });

  it("generated files", () => {
    assert.file(utils.EXPECTED_OUTPUT_FILES);
  });

  it("run npm test", () => {
    // Ensure `npm test` succeeds in generated project.
    generator.spawnCommandSync("npm", ["test"]);
  });

  after(async () => {
    // Clean temp output dir.
    await new Promise((resolve, reject) => {
      helpers.testDirectory(testingDir, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
});