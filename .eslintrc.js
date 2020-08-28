// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: "standard",
  // required to lint *.vue files
  plugins: ["html", "vue"],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    "no-new-func": 0,
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // 对象最后一个键值对后面的逗号可以保留（推荐保留）
    "comma-dangle": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
  }
};
