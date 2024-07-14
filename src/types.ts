import { Fragment, ElementType } from 'react';

// Define the type for React components, which can be either an ElementType or a Fragment.
export type ReactComponent = ElementType | typeof Fragment;

// Define a type for a map of components, where each key is a string and the value is a ReactComponent.
export type ComponentsMap = {
  [key: string]: ReactComponent;
};

// Define an interface for the structure of a component, including its id, component name, and optional children.
export interface ComponentStructure {
  id: string;
  component: string;
  children?: StructureType;
}

// Define a type for a structure, which is an array of ComponentStructure.
export type StructureType = ComponentStructure[];

// Define a type for component props, where the keys are strings and the values can be any type.
export type ComponentProps = {
  [key: string]: unknown;
};

// Define a type for the function that maps props based on component ID and name.
export type GetMappedProps = (
  keys: {
    componentID: string;
    componentName: string;
  },
  props: ComponentProps,
) => ComponentProps;

// Define a type for the function that gets the shape of the component, specifying its parts.
export type GetShapeProps = (
  keys: {
    containerID?: string;
    componentID?: string;
    containerName?: string;
    componentName?: string;
  },
  components: {
    Content?: ReactComponent;
    Container?: ReactComponent;
    Component?: ReactComponent;
  },
) => ReactComponent;

// Define a type for the function that recursively gets the higher-order component (HOC).
export type GetRecursiveHOC = (
  args: {
    structure: StructureType;
    components: ComponentsMap;
  },
  Result?: ReactComponent,
) => ReactComponent;
