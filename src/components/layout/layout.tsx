import React from "react";

import { Card, CardHeader, Divider, CardBody } from "@nextui-org/react";

import styles from "./layout.module.scss";

type TLayoutProps = React.PropsWithChildren<{
    header?: React.ReactNode;
}>;

export const Layout: React.FC<TLayoutProps> = ( { header, children } ) => {
    return (
        <div className={styles.layout}>
            <div id="layout-container" className="container">
                <Card>
                    <CardHeader className={styles.header}>
                        { header || null }
                    </CardHeader>

                    <Divider/>

                    <CardBody className={styles.body}>
                        { children }
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Layout;
