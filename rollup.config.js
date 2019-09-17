import autoprefixer from 'autoprefixer'
import { terser } from 'rollup-plugin-terser'
import htmlMinifier from 'rollup-plugin-html-minifier'
import typescript from 'rollup-plugin-typescript2'
import livereload from 'rollup-plugin-livereload'
import emitFiles from 'rollup-plugin-emit-files'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import emitEJS from 'rollup-plugin-emit-ejs'
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace'
import serve from 'rollup-plugin-serve'
import del from 'rollup-plugin-delete'

const src = 'src'
const dest = 'dist'
const production = !process.env.ROLLUP_WATCH

export default async () => ({
  input: `${src}/javascripts/index.ts`,
  output: {
    dir: dest,
    entryFileNames: '[hash].js',
    format: 'iife',
    sourcemap: !production && 'inline'
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({ clean: true }),
    postcss({
      extract: true,
      minimize: production,
      sourceMap: !production && 'inline',
      plugins: [autoprefixer]
    }),
    emitEJS({ src: `${src}/views`, layout: `${src}/views/layout.html.ejs` }),
    emitFiles({ src: 'static' }),
    del({ targets: `${dest}/**/*` }),
    replace({ production }),
    !production && livereload({ watch: dest }),
    !production && serve({ contentBase: dest }),
    production && htmlMinifier({ collapseWhitespace: true }),
    production && terser()
  ]
})
