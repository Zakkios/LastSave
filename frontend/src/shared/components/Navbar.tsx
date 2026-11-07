import ButtonLink from "./Button/ButtonLink";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center justify-between bg-background/80 backdrop-blur-sm border-zinc-800 border-b px-4 gap-3">
      <h1 className="md:text-2xl text-lg font-bold text-zinc-50">LastSave</h1>

      <div className="flex gap-3">
        <ButtonLink to="/login" variant="ghost">
          Connexion
        </ButtonLink>
        <ButtonLink to="/register" variant="primary">
          Inscription
        </ButtonLink>
      </div>
    </nav>
  );
};

export default Navbar;
