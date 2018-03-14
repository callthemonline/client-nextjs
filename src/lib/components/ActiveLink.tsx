import { withRouter } from "next/router";

const ActiveLink = ({ children, router, href }) => {
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

export default withRouter(ActiveLink) as React.SFC<{ href: string }>;
