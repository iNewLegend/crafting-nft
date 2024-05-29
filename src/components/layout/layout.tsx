import React from "react";

import { Card } from "@nextui-org/react";

import "./layout.scss";

export default function Layout( { children }: { children: React.ReactNode } ) {
    return (
        <div className="layout">
            <Card className="container">
                { children }
            </Card>
        </div>
    );
};
