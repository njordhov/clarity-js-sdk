import path = require("path");
import assert = require("yeoman-assert");
import yo_env = require("yeoman-environment");
import Generator = require("yeoman-generator");
import helpers = require("yeoman-test");
import utils = require("./util");

describe("specify output arg as existing directory", () => {
  let testingDir: string;
  let generator: Generator;

  before(async () => {
    testingDir = path.join(__dirname, "../.yo-test/example-proj");
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

  it("generate a project", async () => {
    const appPath = path.join(__dirname, "../generators/app");
    generator = helpers.createGenerator(appPath, [], [], {
      skipInstall: true
    });

    // Run yo-generator to output project.
    await Promise.resolve(generator.run());

    // Validate output directory.
    const outputDir = generator.destinationRoot();
    assert.strictEqual(path.basename(outputDir), path.basename("example-proj"));
  });

  it("generated files", () => {
    assert.file(utils.EXPECTED_OUTPUT_FILES);
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
