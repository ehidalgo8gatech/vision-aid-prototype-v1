import { ServerResponse, request } from 'http';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Request = request
global.Response = ServerResponse
global.XMLHttpRequest = undefined;
