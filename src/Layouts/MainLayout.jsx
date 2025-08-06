import PropTypes from 'prop-types';

import Header from './Header';
import Menu from './Menu';

import './MainLayout.css';

const MainLayout = (props) => {
    return (
        <div id="container">
            <Menu />
            <div id="main">
                <Header title={props.title} />
                <div id="content">{props.children}</div>
            </div>
        </div>
    );
};

MainLayout.propTypes = {
    title: PropTypes.string,
    children: PropTypes.object,
};

export default MainLayout;
