export class Application implements Component {
  public element!: Element

  public mount(element: Element): void {
    this.element = element
  }

  public unmount(): void {

  }
}
