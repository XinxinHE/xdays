import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

const style = {
    margin: '10px 0',
};

export default function AppBreadcrumbs(props) {
    return (
        <Breadcrumbs aria-label="breadcrumb" style={style}>
            <Link color="inherit" href="/"> Home </Link>
            <Typography color="textPrimary">{props.storyTitle}</Typography>
        </Breadcrumbs>
    );
} 