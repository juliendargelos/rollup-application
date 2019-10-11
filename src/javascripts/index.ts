import '../stylesheets/index.sass'
import { Application } from './application'

const application = new Application()
application.mount(document.querySelector('.application')!)

if (!production) (global as any).application = application
