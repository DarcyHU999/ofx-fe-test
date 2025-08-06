import './Header.css';

const Header = (props) => {
    return (
        <header>
            <div className={`header-wrap`}>
                <h1 className="header-title">{props.title}</h1>
            </div>
            <div className="header-shadow" />
        </header>
    );
};

export default Header;
