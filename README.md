# React & React Native – getRecursiveHOC

## Introduction

React.js was created to simplify user interface development by breaking down the UI into individual components that can be combined to form an application. However, it's easy to fall into bad practices when developing with React.js, leading to issues like unnecessary re-renders, non-reusable components, accidental component rebuilding, complex component integration, and large, hard-to-debug component hierarchies. The desire to create component hierarchies in a simpler, more dynamic way was the first inspiration for developing this dependency.

Additionally, repeatedly passing properties from parent components to children to share the same "state" across the interface can be cumbersome. While state managers like Redux address this, they can sometimes be overkill for your needs. This led us to use React "contexts" or similar solutions. Providing an alternative for state management was the second inspiration for this dependency.

Lastly, developers often iterate over arrays to render multiple components using `array.map(({...}) => <Component {...} />)`. However, not all dynamic components are lists; sometimes they are structures. While lists change the number of their elements, structures don't alter the quantity but modify their properties. Having a method to declare a "structure" using JSON and dynamically transform it into an application was the third and final inspiration for this dependency.

Let's explore how these three issues were addressed in this lightweight dependency.

## Description

* What is this?

“getRecursiveHOC” is a JavaScript dependency for React designed to explore a new paradigm for developing user interfaces using individual components and a JSON structure that connects them.

* What does this React dependency do?

It enables faster and easier interface development, considering future support, maintenance, and code additions.

* How does this React dependency work?

This dependency introduces a new paradigm based on a JSON structure that defines the interface and a series of individual components that render this structure. Internally, the JSON is processed by a function that recursively creates Higher-Order Components (HOCs), nesting them and assigning their properties separately until the interface is completely wrapped in a final component. Following this approach, developers will find the development process faster and more comprehensible.

* What do the developers and the project gain by using it?

Developers benefit from more organized and segmented code under a paradigm that facilitates changes, maintenance, and scalability. Additionally, the JSON that serves as the interface structure allows developers to more easily visualize the hierarchy of components, serving as a simple guide.

* And finally, the most important question: What’s the difference between using this dependency and just `.map` components based on a structure?

This dependency is essentially a recursive function that transforms a structure represented in JSON into a single final component. This structuring happens only once, during "definition time" (it could be during build-time or compile-time, it depends), not at runtime, like Higher-Order Components (HOCs). Typically, dynamic structures are defined at render time by mapping arrays to create multiple components in a single direction. However, HOCs create static structures by joining components together and structuring them before being used. Much like `closures` wrap variables into functions, `HOCs` wrap logic and other components one within another. Now, imagine a function that recursively iterates through a JSON structure, wrapping Higher-Order Components one within another and assigning props to each layer component using ids in an isolated way without affecting other layers until it creates a single final component.

## Installation

```bash
npm install --save get-recursive-hoc
```

## Learn to use it

Most of the time, the best way to explain something is with an example. Let's create a dynamic form to explore this dependency.

### Import and declare

Here's how to use it:

```javascript
import getRecursiveHOC from 'get-recursive-hoc'

// This is an example that defines a new component at build time (don't use this way at runtime, in that case wrap it in a useRef).
const Form = getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })

// This is an example of exporting a new component.
export default getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })

// This is an example of creating a dynamic component at runtime.
const Form = useRef(
  getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS }),
).current;
```

This code creates a dynamic form using `getRecursiveHOC` in various ways. Now, let's see what `structure` and `components` are.

### What is "components"?

The `components` attribute is an object containing the components. These components will be mapped by the `structure` attribute, which will be explained in the next section. Continuing with the form example, this will be our `COMPONENTS` object.

```javascript
import getRecursiveHOC from 'get-recursive-hoc'

import {
  Row,
  Column,
  Switch,
  TextInput,
  VerticalLine,
  HorizontalLine,
} from './components'

const STRUCTURE = [] // The structure will be explained later.

// These are normal components inside an object (it is recommended to wrap them with a React.memo).
const COMPONENTS = {
  Row,
  Switch,
  Column,
  TextInput,
  VerticalLine,
  HorizontalLine,
}

const Form = getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })
```

### What is "structure"?

The `structure` attribute is an array of objects. These objects must have two mandatory attributes and one optional attribute.

"COMPONENT_EXAMPLE" is an object that represents a component that doesn't have children.

The "id" attribute identifies the component in the final structure. With this "id", the developer can send properties directly to the components. It's not mandatory to have unique "ids" in these objects (unlike components generated by a .map, it is not necessary to have unique identifiers in components generated by this dependency). The purpose of the "id" attribute is to identify a component to send it properties directly. Having more than one element with the same "id" means sharing properties with multiple components.

The "component" attribute is the name of the component that represents the object, in this case, it represents a "TextInput". It is important that the name of the component is included in the COMPONENTS object explained before:

```javascript
import { TextInput, ... } from './components'

const COMPONENTS = { TextInput, ... }

const COMPONENT_EXAMPLE = {
  id: 'myInput',
  component: 'TextInput',
}
```

"CONTAINER_EXAMPLE" is an object that represents a component that has children. The "children" attribute is an array of more objects that will be children of the component specified in the "component" attribute (in this case, a "Row"). Child elements can also have more children.

```javascript
import { Row, Switch, TextInput, ... } from './components'

const COMPONENTS = { Row, Switch, TextInput, ... }

const CONTAINER_EXAMPLE = {
  id: 'myRow',
  component: 'Row',
  children: [
    {
      id: 'myInput',
      component: 'TextInput',
    },
    {
      id: 'mySwitch',
      component: 'Switch',
    },
  ],
}
```

With this clear, here is the example of the structure attribute that we will use, continuing with the form example:

```javascript
import {
  Row,
  Column,
  Switch,
  TextInput,
  VerticalLine,
  HorizontalLine,
} from './components'

const COMPONENTS = {
  Row,
  Switch,
  Column,
  TextInput,
  VerticalLine,
  HorizontalLine,
}

const STRUCTURE = [
  {
    id: 'firstInput',
    component: 'TextInput',
  },
  {
    id: 'horizontal',
    component: 'HorizontalLine',
  },
  {
    id: 'row',
    component: 'Row',
    children: [
      {
        id: 'firstSwitch',
        component: 'Switch',
      },
      {
        id: 'vertical',
        component: 'VerticalLine',
      },
      {
        id: 'secondSwitch',
        component: 'Switch',
      },
    ],
  },
  {
    id: 'horizontal',
    component: 'HorizontalLine',
  },
  {
    id: 'row',
    component: 'Row',
    children: [
      {
        id: 'secondInput',
        component: 'TextInput',
      },
      {
        id: 'vertical',
        component: 'VerticalLine',
      },
      {
        id: 'secondInput',
        component: 'TextInput',
      },
    ],
  },
]
```

### Usage and execution

Finally, use the result of `getRecursiveHOC` as a normal component. Send properties to internal components using the `id` attribute specified in the `structure` or via `${componentName}Props` to share props with all the components, like this:

```javascript
import getRecursiveHOC from 'get-recursive-hoc'
import { View, SafeAreaView } from 'react-native'
import React, { useState, useCallback, useRef } from 'react'

import {
  Row,
  Column,
  Switch,
  TextInput,
  VerticalLine,
  HorizontalLine,
} from './components'
import style from './style'

const COMPONENTS = {
  Row,
  Switch,
  Column,
  TextInput,
  VerticalLine,
  HorizontalLine,
}

const STRUCTURE = [
  {
    id: 'firstInput',
    component: 'TextInput',
  },
  {
    id: 'horizontal',
    component: 'HorizontalLine',
  },
  {
    id: 'row',
    component: 'Row',
    children: [
      {
        id: 'firstSwitch',
        component: 'Switch',
      },
      {
        id: 'vertical',
        component: 'VerticalLine',
      },
      {
        id: 'secondSwitch',
        component: 'Switch',
      },
    ],
  },
  {
    id: 'horizontal',
    component: 'HorizontalLine',
  },
  {
    id: 'row',
    component: 'Row',
    children: [
      {
        id: 'secondInput',
        component: 'TextInput',
      },
      {
        id: 'vertical',
        component: 'VerticalLine',
      },
      {
        id: 'secondInput',
        component: 'TextInput',
      },
    ],
  },
]

const Form = getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })

function App() {
  const [state, setState] = useState({
    firstInput: '',
    secondInput: '',
    firstSwitch: false,
    secondSwitch: false,
  })

  const onSetValue = useCallback((key) => (value) => (
    setState((oldState) => ({ ...oldState, [key]: value }))
  ), [])

  return (
    <SafeAreaView style={style.app}>
      <View style={style.form}>
        <Form
          // These are props specified by "id".
          firstInput={{ label: 'First', value: state.firstInput }}
          firstSwitch={{ label: 'Second', value: state.firstSwitch }}
          secondSwitch={{ label: 'Third', value: state.secondSwitch }}
          secondInput={{
            label: 'Fourth',
            style: style.halfInput,
            value: state.secondInput,
          }}
          // These are props specified by "component".
          switchProps={{ setValue: onSetValue }} // In the structure: component: 'Switch' => As a "prop": switchProps
          textInputProps={{ setValue: onSetValue }} // In the structure: component: 'TextInput' => As a "prop": textInputProps
        />
      </View>
    </SafeAreaView>
  )
}
```

## Thank you!

Thank you for reading this documentation. I hope this dependency helps you. Feel free to review the code in the GitHub repository, fork it, or propose changes via pull requests. I plan to upload a playground somewhere to encourage developers to test this dependency, and I'll attach the link when I do.

Until my next random idea!
