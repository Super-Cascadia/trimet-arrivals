import 'jest-enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.URL.createObjectURL = function() {};

configure({ adapter: new Adapter() });
