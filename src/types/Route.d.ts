interface BaseRoute {
  name: string
  component: React.ComponentType<any>
  inNavbar: boolean
  showNavbar?: boolean
}

export interface InNavbarRoute extends BaseRoute {
  inNavbar: true
  icons: {
    active: number
    inactive: number
  }
}

export interface NotInNavbarRoute extends BaseRoute {
  inNavbar?: false
}

type Route = InNavbarRoute | NotInNavbarRoute
