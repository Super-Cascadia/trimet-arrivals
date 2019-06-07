import 'jest-enzyme';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

window.URL.createObjectURL = function() {};

configure({ adapter: new Adapter() });
