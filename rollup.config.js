import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default [
	{
		input: 'src/main.js',
		output: {
			file: 'docs/js/main.js',
			format: 'iife',
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
		input: 'src/worker.js',
		output: {
			file: 'docs/js/worker.js',
			format: 'iife',
		},
		plugins: [
			resolve()
		]
	}
]
