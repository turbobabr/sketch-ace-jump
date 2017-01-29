import focus from './focus';
import { InspectorField } from './constants';

const focusOnControl = (context,id) => {
  focus(context,id);
};

DefineSketchExtension({
  name: 'Ace Jump',
  identifier: 'com.turbobabr.ace-jump',
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
    'CommonStyle.color': {
      name: 'Text/Fill Color',
      shortcut: 'control-shift-c',
      run(context) {
        focusOnControl(context,InspectorField.StyleColor);
      }
    }
  }
});