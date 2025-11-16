// This file runs BEFORE any imports or test framework setup
// It polyfills TextEncoder/TextDecoder for Node.js test environment
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
