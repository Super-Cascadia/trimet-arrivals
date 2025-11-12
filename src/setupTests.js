import 'jest-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.URL.createObjectURL = function() {};

window.global.navigator = {};

window.navigator = {};


configure({ adapter: new Adapter() });
