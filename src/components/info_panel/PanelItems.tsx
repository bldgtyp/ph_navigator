import React from 'react';
import { Stack } from "@mui/material";


export function PanelItem(props: { label: React.ReactNode; value: string; }) {
    return (
        <Stack direction="column">
            <p className="panel-item-heading">{props.label}:</p>
            <p className="panel-item-value">{props.value}</p>
        </Stack>
    );
}

export function IdentifierItem(props: { label: React.ReactNode; value: string; }) {
    return (
        <Stack direction="column">
            <p className="identifier-item-heading">{props.label}:</p>
            <p className="identifier-item-value">{props.value}</p>
        </Stack>
    );
}
