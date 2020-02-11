import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default [
	{
		input: 'src/main.js',
		output: {
			file: 'docs/js/main.js',
			format: 'esm',
		},
		plugins: [
			resolve({
				main: true,
				browser: true
			}),
			commonjs(),
		]
	},
	{
		input: 'src/api-worker.js',
		output: {
			file: 'docs/js/api-worker.js',
			format: 'umd',
		},
		plugins: [
			resolve()
		]
	}
]
