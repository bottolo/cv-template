import {createRootRoute, Link, Outlet} from '@tanstack/react-router'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <Link className={"[&.active]:font-bold"} to="/">Home</Link>
            <Link className={"[&.active]:font-bold"} to="/about">About</Link>
            <Outlet/>
        </>
    )
}
