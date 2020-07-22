import React from 'react';
import { Switch, Route, IndexRoute } from 'react-router-dom';

import AppWrapper from './modules/App/AppWrapper';

import HomePage from './modules/App/pages/HomePage';

import CmsPage from './modules/Cms/pages/CmsPage';

import AgenciesPage from './modules/Agency/pages/AgenciesPage';

import AgencyPage from './modules/Agency/pages/AgencyPage';

import SimulatorsPage from './modules/Simulator/pages/SimulatorsPage';

import NewsPage from './modules/News/pages/NewsPage';

import ErrorPage from './modules/App/pages/ErrorPage';

export default (
    <Switch>
        <Route exact path="/" component={HomePage} />

        <Route path="/agency/:id?" component={AgencyPage} />
        <Route path="/agencies/:department?" component={AgenciesPage} />

        <Route path="/simulators/:type?" component={SimulatorsPage} />

        <Route path="/news" component={NewsPage} />

        <Route path="/page/:path/:sub?" component={CmsPage} />

        <Route component={ErrorPage} />
    </Switch>
);
