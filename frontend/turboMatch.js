import type {Map} from 'immutable';
import type Store from './Store';

function turboMatch(node: Map, searchText: string, key: string, store: Store) {
  var { testName, testProps } = parseTurboQuery(searchText);

  if (node.get('name') && node.get('nodeType') !== 'Wrapper') {
    return testName(node.get('name')) && testProps(node.get('props'));
  }
  return false;
}

function parseTurboQuery(query: String) {
  var isRegex = false;
  var propRequirements = {};

  var questionMarkIndex = query.indexOf('?');
  var stringPart = questionMarkIndex < 0 ? query : query.slice(0, questionMarkIndex);
  if (stringPart[0] === '/' && stringPart[stringPart.length - 1] === '/') {
    isRegex = true;
    stringPart = stringPart.slice(1, stringPart.length - 1);
  }
  var propsPart = questionMarkIndex < 0 ? '' : query.slice(questionMarkIndex + 1);
  if (propsPart.length > 0) {
    var arr = propsPart.split('&');
    arr.forEach((queryPart) => {
      var equalsIndex = queryPart.indexOf('=');
      if (equalsIndex < 0) {
        return;
      }
      var propName = queryPart.slice(0, equalsIndex);
      var propVal = queryPart.slice(equalsIndex + 1);
      propRequirements[propName] = propVal;
    });
  }

  var testName = name => validString(name, stringPart, isRegex);
  var testProps = (props) => {
    var propNames = Object.keys(propRequirements);
    return propNames.reduce((trueSoFar, propName) => {
      return trueSoFar && ('' + props[propName]) === propRequirements[propName];
    }, true);
  };
  
  return {
    testName,
    testProps,
  };
}

function validString(str: string, needle: string, regex: boolean): boolean {
  if (regex) {
    var re = new RegExp(needle, 'i');
    return re.test(str.toLowerCase());
  }
  return str.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
}

module.exports = turboMatch;
