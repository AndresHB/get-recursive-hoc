import { Fragment } from 'react';

import {
  GetShapeProps,
  ComponentsMap,
  StructureType,
  ReactComponent,
  ComponentProps,
  GetMappedProps,
  GetRecursiveHOC,
} from './types';

// A function to get props. If the component is a Fragment, return an empty object, otherwise return the props.
const getFragmentProps = (
  component: ReactComponent,
  props: ComponentProps,
): ComponentProps => (component === Fragment ? {} : props);

// Function to map props based on component ID and name.
const getMappedProps: GetMappedProps = (
  { componentID, componentName },
  props,
) => {
  if (componentID || componentName) {
    // Create a name for the props based on the component name.
    const nameWithProps = `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}Props`;

    return {
      id: componentID,
      ...(props[nameWithProps] as object), // Spread the named props if they exist.
      ...(props[componentID] as object), // Spread the props specific to the component ID if they exist.
    };
  }
  return props;
};

// Function to get the shape of a component, specifying its container, content, and component.
const getShape: GetShapeProps =
  (
    {
      containerID = '',
      componentID = '',
      containerName = '',
      componentName = '',
    },
    { Container = Fragment, Content = Fragment, Component = Fragment },
  ) =>
  (props: ComponentProps) => {
    // Get other props for Content, Component and Container, ensuring Fragment components get empty props.
    const otherProps = getFragmentProps(Content, props);
    const componentProps = getFragmentProps(
      Component,
      getMappedProps({ componentID, componentName }, props),
    );
    const containerProps = getFragmentProps(
      Container,
      getMappedProps(
        { componentID: containerID, componentName: containerName },
        props,
      ),
    );

    return (
      // Return the structure of the component with the appropriate props.
      <Container {...containerProps}>
        <Content {...otherProps} />
        <Component {...componentProps} />
      </Container>
    );
  };

// Recursive function to get the higher-order component (HOC).
const getRecursiveHOC: GetRecursiveHOC = (
  { structure: [next, ...other], components },
  Result = Fragment,
) => {
  // Determine if the next component is a container by checking if it has children.
  const isContainer: boolean = Array.isArray(next.children);
  const NextComponent: ReactComponent = components[next.component];

  // If the component is a container, get its shape with nested structure.
  const Component = isContainer
    ? getShape(
        { containerID: next.id, containerName: next.component },
        {
          Container: NextComponent,
          Content: getRecursiveHOC(
            { structure: next.children!, components },
            Fragment,
          ),
        },
      )
    : NextComponent;

  // Get the shape of the next result, determining its content and component parts.
  const NextResult = getShape(
    isContainer ? {} : { componentID: next.id, componentName: next.component },
    { Content: Result, Component },
  );

  // If there are more components in the structure, continue recursion, otherwise return the next result.
  return other.length
    ? getRecursiveHOC({ structure: other, components }, NextResult)
    : NextResult;
};

// Export the main function that initiates the recursive HOC creation.
export default (args: {
  structure: StructureType;
  components: ComponentsMap;
}) => getRecursiveHOC(args);
