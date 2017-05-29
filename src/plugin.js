import focus from './focus';
import { InspectorField } from './constants';

const focusOnControl = (context,id) => {
  focus(context,id);
};

DefineSketchExtension({
  name: 'Ace Jump',
  identifier: 'com.turbobabr.ace-jump',
  description: "Quickly focus on various inspector's fields like font size, font weight and text/fill color using shortcuts.",
  version: '0.1.1',
  author: 'Andrey Shakhmin',
  homepage: 'https://github.com/turbobabr/sketch-ace-jump',
  commands: {
    'TextStyle.fontSize': {
      name: 'Font Size',
      shortcut: 'control-s',
      run(context) {
        focusOnControl(context,InspectorField.FontSize);
      }
    },
    'TextStyle.fontWeight': {
      name: 'Font Weight',
      shortcut: 'control-w',
      run(context) {
        focusOnControl(context,InspectorField.FontWeight);
      }
    },
    'Style.color': {
      name: 'Text/Fill Color',
      shortcut: 'control-shift-c',
      run(context) {
        focusOnControl(context,InspectorField.StyleColor);
      }
    }
  },
  menu: {
    items: [
      'TextStyle.fontSize',
      'TextStyle.fontWeight',
      'Style.color'
    ]
  }

});