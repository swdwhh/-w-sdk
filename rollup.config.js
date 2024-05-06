import path from "path";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;
const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "src/index.js");
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));
const IS_BROWSER_BUNDLE = !!PKG_JSON.browser;
const formats = IS_BROWSER_BUNDLE ? ["umd"] : ["es", "cjs"];

const extensions = [".js"];

export default formats.map((format) => ({
  input: INPUT_FILE,
  output: { file: `lib/index.${format}.js`, format, indent: false },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: ["node_modules/**"],
      extensions,
      plugins: [["@babel/plugin-transform-runtime"]],
      babelHelpers: "runtime",
    }),
  ],
}));
