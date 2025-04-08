
const MainNav = () => {
    return (
        <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4">
                <h1 className="text-xl font-bold">Admin User System</h1>
                <UserNav user={session.user} />
            </div>
        </header>
    )
}

export default MainNav
