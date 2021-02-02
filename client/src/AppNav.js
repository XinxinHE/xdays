import React from "react";
import { Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import "./AppNav.css";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));
  
function AppNav() {
    const classes = useStyles();

    return(
        <div className={classes.root}>
        <AppBar color="inherit" position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    X Days
                </Typography>
                <Button>Sign up</Button>
                <Button>Sign in</Button>
            </Toolbar>
        </AppBar>
        </div>
    );
}
export default AppNav;