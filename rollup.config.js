import devcert from 'devcert'
import autoprefixer from 'autoprefixer'
import autoExternal from 'rollup-plugin-auto-external'
import htmlMinifier from 'rollup-plugin-html-minifier'
import nodeResolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import emitFiles from 'rollup-plugin-emit-files'
import commonjs from '@rollup/plugin-commonjs'
import emitEJS from 'rollup-plugin-emit-ejs'
import cleaner from 'rollup-plugin-cleaner'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'
import alias from '@rollup/plugin-alias'
import serve from 'rollup-plugin-serve'
import ts from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'
import { eslint } from 'rollup-plugin-eslint'

import tsconfig from './tsconfig.json'

const src = 'src'
const dest = 'dist'
const development = process.env.ROLLUP_WATCH
const production = !development

export default async () => ({
  input: `${src}/javascripts/index.ts`,
  output: {
    dir: dest,
    entryFileNames: production ? '[hash].js' : 'index.js',
    format: 'iife',
    sourcemap: development
  },
  plugins: [
    postcss({
      extract: true,
      minimize: production,
      plugins: [autoprefixer]
    }),
    autoExternal(),
    nodeResolve(),
    commonjs(),
    ts(),
    eslint(),
    cleaner({ targets: [dest] }),
    replace({ production, development }),
    emitEJS({ src: `${src}/views`, layout: `${src}/views/layout.html.ejs` }),
    alias({
      resolve: ['.ts'],
      entries: Object
        .entries(tsconfig.compilerOptions.paths)
        .map(([find, [replacement]]) => ({ find, replacement }))
    }),
    development && serve({
      contentBase: [dest, 'static'],
      https: await devcert.certificateFor('localhost', { getCaPath: true })
    }),
    development && livereload({ watch: dest }),
    production && emitFiles({ src: 'static' }),
    production && htmlMinifier({ collapseWhitespace: true }),
    production && terser()
  ]
})
