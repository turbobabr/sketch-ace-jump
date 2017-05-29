
import { InspectorField, JumpAction } from './constants';

const ClassName = {
  MSTextLayer: 'MSTextLayer',
  MSStyledLayer: 'MSStyledLayer',
  MSNormalInspector: 'MSNormalInspector',
  MSTextLayerSection: 'MSTextLayerSection'
};

const containsLayersOfType = (list,type) => {
  return list.filteredArrayUsingPredicate(NSPredicate.predicateWithFormat(`self isKindOfClass: %@`,NSClassFromString(type))).count() > 0;
};

const performAction = (context, control,action) => {
  const { document } = context;
  const window = document.documentWindow();

  switch(action) {
    case JumpAction.MakeFirstResponder:
      window.makeFirstResponder(control);
      break;
    case JumpAction.PerformClick:
      control.performClick(null);
      break;
  }
};

export const Descriptors = {
  //  Text Style.
  [InspectorField.FontSize]: {
    id: InspectorField.FontSize,
    name: 'Font Size',
    controllerClass: ClassName.MSNormalInspector,
    path: 'standardInspectors.layerViewController.layerInspectorControllers',
    sectionController: ClassName.MSTextLayerSection,
    subPath: 'fontSizeField',
    action: JumpAction.MakeFirstResponder
  },
  [InspectorField.FontWeight]: {
    id: InspectorField.FontWeight,
    name: 'Font Weight',
    controllerClass: ClassName.MSNormalInspector,
    path: 'standardInspectors.layerViewController.layerInspectorControllers',
    sectionController: ClassName.MSTextLayerSection,
    subPath: 'fontWeightPopUpButton',
    action: JumpAction.PerformClick
  },
  [InspectorField.StyleColor]: {
    id: InspectorField.StyleColor,
    name: 'Text/Fill Color',
    exec: (context) => {
      const { selection, document } = context;
      if(containsLayersOfType(selection,ClassName.MSTextLayer)) {
        focus(context,InspectorField.TextColor);
      } else if(containsLayersOfType(selection,ClassName.MSStyledLayer)) {
        const currentController = document.valueForKeyPath('inspectorController.currentController');
        if(currentController.className() != ClassName.MSNormalInspector) {
          return;
        }

        const fillControllers = currentController.valueForKeyPath('standardInspectors.fillViewController.stylePartViewControllers');
        if(fillControllers.count()<1 || !fillControllers.lastObject()) {
          return;
        }

        performAction(context,fillControllers.lastObject().colorButton(),JumpAction.PerformClick);
      }
    }
  },
  [InspectorField.TextColor]: {
    id: InspectorField.TextColor,
    name: 'Text Color',
    controllerClass: ClassName.MSNormalInspector,
    path: 'standardInspectors.layerViewController.layerInspectorControllers',
    sectionController: 'MSTextLayerSection',
    subPath: 'colorPickerButton',
    action: JumpAction.PerformClick
  }
};

const focus = (context,field) => {
  const { document } = context;

  const descriptor = Descriptors[field];
  if(!descriptor) {
    return;
  }

  if(descriptor.exec) {
    descriptor.exec(context);
    return;
  }

  const currentController = document.valueForKeyPath('inspectorController.currentController');
  if(currentController.className() != descriptor.controllerClass) {
    return;
  }

  const findControl = (descriptor) => {
    if(!descriptor.sectionController) {
      return currentController.valueForKeyPath(descriptor.path);
    }

    const sections = currentController.valueForKeyPath(descriptor.path);
    const targetSection = sections.filteredArrayUsingPredicate(NSPredicate.predicateWithFormat(`className == '${descriptor.sectionController}'`)).firstObject();
    if(!targetSection) {
      return null;
    }

    return targetSection.valueForKeyPath(descriptor.subPath);
  };

  const control = findControl(descriptor);
  if(!control) {
    return
  }

  performAction(context,control,descriptor.action);
};

export default focus;