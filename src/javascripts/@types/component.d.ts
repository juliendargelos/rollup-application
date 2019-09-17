declare interface Component {
  element: Element
  mount(element: Element): void
  unmount(): void
}
