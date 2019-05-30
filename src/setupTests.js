import 'jest-enzyme';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

window.URL.createObjectURL = function() {};

window.global.navigator = {};

window.navigator = {};


configure({ adapter: new Adapter() });
