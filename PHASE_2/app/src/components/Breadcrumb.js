import { useLocation } from "react-router-dom";

import { Breadcrumb as AntBreadcrumb } from 'antd';

export default function BreadCrumb() {

    const location = useLocation();
    
    // create array of path names from the current path
    // capitalise each first letter of each word, remove slashes and hyphens
    var names = [];

    location.pathname.split("/").forEach(name => {
        let thisName = "";

        name.split("-").forEach(word => {
            thisName += word.charAt(0).toUpperCase() + word.substring(1) + " ";
        });

        names.push(thisName);
    });

    // remove the first element which is a false empty path
    names.splice(0,1);

    return (
        <div style={{ margin: '1em 0.2em 1em 0.1em' }}>
            <AntBreadcrumb>
                <AntBreadcrumb.Item>Home</AntBreadcrumb.Item>
                {names.map((name, index) => (
                    <AntBreadcrumb.Item key={{index}}>{name}</AntBreadcrumb.Item>
                ))}
            </AntBreadcrumb>
        </div>
    );
}
