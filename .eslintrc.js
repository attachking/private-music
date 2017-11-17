// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
/*  globals: {
    $: true
  },*/
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'eol-last': 0,
    //函数括号 ( 前是否需要空格
    'space-before-function-paren': 0,
    //空行最多不能超过一行
    'no-multiple-empty-lines': [1, {'max': 1}]
  }
}
/*
*  spaced-comment  注释'//'后需要有空格
*  space-before-function-paren 函数括号左括号'('前不需要空格,右括号')'后需要空格
*  key-spacing 对象字面量中冒号的前后空格(':'前不需要,':'后需要空格)
*  comma-spacing 逗号前不需要空格,逗号后需要空格
*  comma-style 逗号风格(行尾)
*  no-multiple-empty-lines 空行不能连续出现两行
*  comma-dangle 对象字面量项尾不能有逗号
*  no-unused-vars 不能有声明后未被使用的变量或参数
*  semi 不使用分号
*  quotes 引号类型为单引号
*  space-infix-ops 中缀操作符周围要有空格(如等号左右需要空格)
*  eqeqeq 必须使用全等 === 和 !==
*/
