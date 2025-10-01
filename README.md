# React & React Native – getRecursiveHOC

## Build UIs from JSON structures using real HOCs (no .map)

Design your interface as a simple JSON structure and compose it into a single React component at definition time. No list mapping, no prop drilling across the tree, and clean, isolated props per layer. Works in React and React Native.

- **What it is**: A tiny utility that recursively composes Higher-Order Components (HOCs) from a JSON structure and a components map.
- **What you get**: Faster development, a clearer mental model, and highly reusable components with isolated prop mapping.

---

## Why use this?

- **Model the UI, not the rendering loop**: Describe your hierarchy with JSON; the library does the composition.
- **Real HOC composition**: Structure is composed once at definition/compile time, not re-created with render-time array maps.
- **Isolated props per layer**: Send props by `id` or by `component` type without drilling through parents.
- **Scalable and maintainable**: A declarative structure doubles as documentation and makes refactors safer.

---

## Installation

```bash
npm install --save get-recursive-hoc
```

---

## Quick start

```tsx
import getRecursiveHOC from 'get-recursive-hoc'

// 1) Your components (recommend wrapping with React.memo in your app)
import { Row, Column, Switch, TextInput, VerticalLine, HorizontalLine } from './components'

const COMPONENTS = { Row, Column, Switch, TextInput, VerticalLine, HorizontalLine }

// 2) Describe your UI as a structure
const STRUCTURE = [
  { id: 'firstInput', component: 'TextInput' },
  { id: 'horizontal', component: 'HorizontalLine' },
  {
    id: 'row',
    component: 'Row',
    children: [
      { id: 'firstSwitch', component: 'Switch' },
      { id: 'vertical', component: 'VerticalLine' },
      { id: 'secondSwitch', component: 'Switch' },
    ],
  },
]

// 3) Compose a real component at definition time
export const Form = getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })
```

Use it like any other component, sending props by `id` or by component type name:

```tsx
<Form
  // Props by id
  firstInput={{ label: 'First', value: state.firstInput }}
  firstSwitch={{ label: 'Enable', value: state.firstSwitch }}
  // Props by component name (All Switch/TextInput receive these)
  switchProps={{ setValue: onSetValue }}
  textInputProps={{ setValue: onSetValue }}
/>
```

---

## Core concepts

- **components**: An object mapping names to React components.
  - Example: `{ Row, Column, Switch, TextInput }`
- **structure**: An array describing the UI tree.
  - Each node: `{ id: string, component: string, children?: StructureType }`
- **Prop mapping**:
  - By id: pass a prop matching the node `id` → that object is spread into that element.
  - By type: pass `${componentName}Props` (lowercased first letter + `Props`) → spread into all nodes of that type.

Example of prop name by component: for `TextInput`, use `textInputProps`.

---

## Prop precedence

When a component receives both type-level and id-level props, they are merged in this order:

1. `${componentName}Props` (type-level, e.g., `textInputProps`)
2. `id`-matched props (e.g., `firstInput`)
3. The library also includes a convenience `id` field inside the props when id-level mapping is used (`{ id: componentID, ... }`)

Because of the merge order, id-level props can override type-level defaults. This makes `${componentName}Props` ideal for shared defaults and `id` props ideal for instance-specific overrides.

---

## Usage patterns

- **Build-time definition** (preferred):
```tsx
const Form = getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })
```

- **Export directly**:
```tsx
export default getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })
```

- **Runtime (stable ref)**: If composing at runtime, keep the result stable.
```tsx
const Form = useRef(
  getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })
).current
```

---

## Full example (React Native)

```tsx
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

const COMPONENTS = { Row, Switch, Column, TextInput, VerticalLine, HorizontalLine }

const STRUCTURE = [
  { id: 'firstInput', component: 'TextInput' },
  { id: 'horizontal', component: 'HorizontalLine' },
  {
    id: 'row',
    component: 'Row',
    children: [
      { id: 'firstSwitch', component: 'Switch' },
      { id: 'vertical', component: 'VerticalLine' },
      { id: 'secondSwitch', component: 'Switch' },
    ],
  },
]

const Form = useRef(
  getRecursiveHOC({ structure: STRUCTURE, components: COMPONENTS })
).current

export default function App() {
  const [state, setState] = useState({
    firstInput: '',
    firstSwitch: false,
  })

  const onSetValue = useCallback((key: string) => (value: unknown) => (
    setState((old) => ({ ...old, [key]: value }))
  ), [])

  return (
    <SafeAreaView style={style.app}>
      <View style={style.form}>
        <Form
          firstInput={{ label: 'First', value: state.firstInput }}
          firstSwitch={{ label: 'Enable', value: state.firstSwitch }}
          switchProps={{ setValue: onSetValue }}
          textInputProps={{ setValue: onSetValue }}
        />
      </View>
    </SafeAreaView>
  )
}
```

---

## When to use / not to use

- **Use when**:
  - You want a declarative structure (JSON) that documents the UI hierarchy.
  - You need clean prop isolation with easy instance overrides and sensible defaults per type.
  - You prefer composing once (HOCs) over building on every render (.map-based trees).

- **Not ideal when**:
  - You are rendering arbitrarily large/variable-length lists (virtualized lists are better).
  - You need per-render, data-driven reshaping of the entire tree rather than a stable structure.

---

## Performance notes

- The composed result is a normal React component. You can and should use `React.memo` for leaves to keep updates predictable.
- Prefer stable `components` and `structure` references; if composed at runtime, keep the result in a stable ref.

---

## API

Default export:

```ts
function getRecursiveHOC(args: {
  structure: { id: string; component: string; children?: any[] }[]
  components: { [name: string]: React.ElementType | typeof Fragment }
}): React.ElementType
```

TypeScript declarations are shipped via `types`.

---

## Tips

- Wrap your leaf components with `React.memo` in your app for predictable performance.
- Reuse `components` and swap only the `structure` to prototype different layouts quickly.
- To share props across all instances of a component type, use `${componentName}Props`.

---

## FAQ

- **How is this different from mapping arrays?**
  Mapping arrays builds UI at render time for lists. This composes a static hierarchy once, as HOCs, which is then used like a normal component.

- **Does every `id` need to be unique?**
  No. Reusing the same `id` sends the same props to multiple nodes intentionally.

- **Is React Native supported?**
  Yes. The output is just React components.

---

## License

MIT © Andrés Hernández Bravo
