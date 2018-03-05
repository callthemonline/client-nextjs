import { SingletonRouter, withRouter } from "next/router";

const ActiveLink: React.SFC<{ href: string; router: SingletonRouter }> = ({
  children,
  router,
  href,
}) => {
  const style = {
    marginRight: 10,
    background: router.pathname === href ? "#eee" : "none",
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  );
};

export default withRouter(ActiveLink);
