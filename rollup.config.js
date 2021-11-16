import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';


export default [{
  input: './src/index.ts',
  output: [{
    name: 'KskiQuery',
    file: './dist/kski-query.js',
    format: 'iife',
    exports: 'named',
  }, {
    name: 'KskiQuery',
    file: './dist/kski-query.min.js',
    format: 'iife',
    exports: 'named',
    plugins: [terser()],
  }],
  plugins: [
    commonjs(),
    resolve(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
}, {
  input: './src/index.ts',
  output: [{
    file: './dist/index.js',
    format: 'cjs',
    sourcemap: 'inline',
    exports: 'default',
  }, {
    file: './dist/index.min.js',
    format: 'cjs',
    sourcemap: 'inline',
    exports: 'default',
    plugins: [terser()],
  }],
  external: ['tiny-segmenter'],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
  ],
}]
